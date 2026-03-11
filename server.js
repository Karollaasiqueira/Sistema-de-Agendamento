if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    console.error('❌ FATAL: SESSION_SECRET não definida nas variáveis de ambiente!');
    process.exit(1);
}

// ==================== SEGURANÇA: HELMET ====================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// ==================== CORS RESTRITO ====================
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : (NODE_ENV === 'production' ? [] : ['http://localhost:3000']);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('CORS: origem não permitida'));
        }
    },
    credentials: true
}));

// ==================== MIDDLEWARES GLOBAIS ====================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==================== RATE LIMITING ====================
const limiterGeral = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const limiterCadastro = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { erro: 'Limite de cadastros atingido. Tente novamente em 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiterGeral);

// ==================== SESSÃO SEGURA ====================
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: './data' }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict'
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// ==================== BANCO DE DADOS ====================
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'agendamento.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Conectado ao banco SQLite');
    }
});

// Habilitar foreign keys e WAL mode para performance/segurança
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');

// ==================== CRIAÇÃO DAS TABELAS ====================
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        cargo TEXT,
        ativo BOOLEAN DEFAULT 1,
        tipo TEXT DEFAULT 'gestor',
        tentativas_login INTEGER DEFAULT 0,
        bloqueado_ate DATETIME,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER UNIQUE,
        nome_empresa TEXT NOT NULL,
        cnpj TEXT,
        inscricao_estadual TEXT,
        atividade TEXT,
        endereco TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        telefone TEXT,
        email TEXT,
        site TEXT,
        logo TEXT,
        cor_primaria TEXT DEFAULT '#667eea',
        cor_secundaria TEXT DEFAULT '#764ba2',
        descricao TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        email TEXT,
        telefone TEXT,
        data_nascimento DATE,
        endereco TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2),
        duracao INTEGER,
        ativo BOOLEAN DEFAULT 1,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS colaboradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        nome TEXT NOT NULL,
        especialidade TEXT,
        telefone TEXT,
        email TEXT,
        ativo BOOLEAN DEFAULT 1,
        foto TEXT,
        descricao TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS colaborador_servico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        colaborador_id INTEGER,
        servico_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE,
        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
        UNIQUE(colaborador_id, servico_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        cliente_id INTEGER,
        servico_id INTEGER,
        colaborador_id INTEGER,
        data_agendamento DATE,
        hora_agendamento TIME,
        status TEXT DEFAULT 'pendente',
        tipo_agendamento TEXT DEFAULT 'unico',
        recorrencia TEXT,
        data_fim_recorrencia DATE,
        agendamento_pai_id INTEGER,
        cancelado_em DATETIME,
        motivo_cancelamento TEXT,
        cancelado_por TEXT,
        cancelamento_com_custo BOOLEAN DEFAULT 0,
        observacoes TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id),
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS configuracoes_avancadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        chave TEXT NOT NULL,
        valor TEXT NOT NULL,
        descricao TEXT,
        UNIQUE(usuario_id, chave),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    // Índices para performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario ON agendamentos(usuario_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_clientes_usuario ON clientes(usuario_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_colaboradores_usuario ON colaboradores(usuario_id)`);

    // Inserir usuário admin padrão apenas se não existir
    db.get("SELECT COUNT(*) as count FROM usuarios WHERE email = 'admin@agendapro.com'", [], (err, row) => {
        if (!err && row.count === 0) {
            const senhaAdmin = process.env.ADMIN_PASSWORD || 'admin123';
            const senhaHash = bcrypt.hashSync(senhaAdmin, 12);
            db.run(
                'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                ['Administrador', 'admin@agendapro.com', senhaHash, 'admin']
            );
            console.log('✅ Usuário admin criado');
        }
    });

    const configsPadrao = [
        ['notificacao_lembrete_horas', '24'],
        ['cancelamento_sem_custo_horas', '2'],
        ['notificar_cliente_lembrete', 'sim'],
        ['notificar_empresa_cancelamento', 'sim'],
        ['permitir_recorrente', 'sim'],
        ['whatsapp_empresa', '']
    ];

    configsPadrao.forEach(([chave, valor]) => {
        db.get("SELECT COUNT(*) as count FROM configuracoes_avancadas WHERE chave = ? AND usuario_id IS NULL", [chave], (err, row) => {
            if (!err && row && row.count === 0) {
                db.run('INSERT OR IGNORE INTO configuracoes_avancadas (chave, valor) VALUES (?, ?)', [chave, valor]);
            }
        });
    });

    db.get("SELECT COUNT(*) as count FROM servicos", [], (err, row) => {
        if (!err && row.count === 0) {
            const servicos = [
                ['Consulta Simples', 'Consulta básica', 100.00, 30],
                ['Consulta Completa', 'Consulta com exames', 200.00, 60],
                ['Procedimento', 'Procedimento simples', 300.00, 90],
                ['Retorno', 'Consulta de retorno', 80.00, 20]
            ];
            servicos.forEach(s => {
                db.run('INSERT INTO servicos (nome, descricao, preco, duracao) VALUES (?, ?, ?, ?)', s);
            });
        }
    });

    db.get("SELECT COUNT(*) as count FROM colaboradores", [], (err, row) => {
        if (!err && row.count === 0) {
            const cols = [
                ['Ana Silva', 'Massoterapeuta', '11988887777', 'ana@exemplo.com', 'Especialista em massagem relaxante'],
                ['Carlos Santos', 'Quiroprata', '11977776666', 'carlos@exemplo.com', 'Quiroprata com 10 anos de experiência'],
                ['Mariana Costa', 'Esteticista', '11966665555', 'mariana@exemplo.com', 'Especialista em limpeza de pele']
            ];
            cols.forEach(c => {
                db.run('INSERT INTO colaboradores (nome, especialidade, telefone, email, descricao) VALUES (?, ?, ?, ?, ?)', c);
            });
        }
    });
});

// ==================== HELPERS ====================
function sanitizeString(str) {
    if (!str) return str;
    return String(str).trim().slice(0, 500);
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// ==================== MIDDLEWARE DE AUTENTICAÇÃO ====================
function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.usuarioId) {
        req.usuarioId = req.session.usuarioId;
        req.usuarioTipo = req.session.usuarioTipo;
        next();
    } else {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ erro: 'Não autenticado' });
        } else {
            return res.redirect('/login.html');
        }
    }
}

// ==================== ROTA DE DIAGNÓSTICO (PROTEGIDA) ====================
app.get('/api/diagnostico', verificarAutenticacao, (req, res) => {
    if (req.usuarioTipo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso restrito a administradores' });
    }
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        const promessas = tables.map(t => new Promise((resolve) => {
            db.get(`SELECT COUNT(*) as count FROM ${t.name}`, [], (err, row) => {
                resolve({ tabela: t.name, registros: row ? row.count : 0 });
            });
        }));
        Promise.all(promessas).then((contagens) => {
            res.json({ status: 'online', tabelas: contagens });
        });
    });
});

// ==================== ROTAS PÚBLICAS ====================
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente', 'index.html'));
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================
app.post('/api/auth/cadastro', limiterCadastro, (req, res) => {
    const nome = sanitizeString(req.body.nome);
    const email = sanitizeString(req.body.email);
    const senha = req.body.senha;
    const telefone = sanitizeString(req.body.telefone);
    const nome_empresa = sanitizeString(req.body.nome_empresa);
    const cnpj = sanitizeString(req.body.cnpj);
    const atividade = sanitizeString(req.body.atividade);

    if (!nome || !email || !senha || !nome_empresa) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ erro: 'Email inválido' });
    }

    if (senha.length < 8) {
        return res.status(400).json({ erro: 'Senha deve ter no mínimo 8 caracteres' });
    }

    db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        if (row) return res.status(400).json({ erro: 'Email já cadastrado' });

        const senhaHash = bcrypt.hashSync(senha, 12);

        db.run(
            'INSERT INTO usuarios (nome, email, senha, telefone, tipo) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senhaHash, telefone, 'gestor'],
            function(err) {
                if (err) return res.status(500).json({ erro: 'Erro interno' });
                const usuarioId = this.lastID;
                db.run(
                    `INSERT INTO empresas (usuario_id, nome_empresa, cnpj, atividade) VALUES (?, ?, ?, ?)`,
                    [usuarioId, nome_empresa, cnpj, atividade],
                    function(err) {
                        if (err) return res.status(500).json({ erro: 'Erro interno' });
                        const configs = [
                            ['notificacao_lembrete_horas', '24'],
                            ['cancelamento_sem_custo_horas', '2'],
                            ['notificar_cliente_lembrete', 'sim'],
                            ['notificar_empresa_cancelamento', 'sim'],
                            ['permitir_recorrente', 'sim'],
                            ['whatsapp_empresa', '']
                        ];
                        configs.forEach(([chave, valor]) => {
                            db.run(
                                'INSERT INTO configuracoes_avancadas (usuario_id, chave, valor) VALUES (?, ?, ?)',
                                [usuarioId, chave, valor]
                            );
                        });
                        res.json({ mensagem: '✅ Cadastro realizado com sucesso!' });
                    }
                );
            }
        );
    });
});

app.post('/api/auth/login', limiterLogin, (req, res) => {
    const email = sanitizeString(req.body.email);
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha obrigatórios' });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ erro: 'Email ou senha inválidos' });
    }

    db.get('SELECT * FROM usuarios WHERE email = ? AND ativo = 1', [email], (err, usuario) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });

        // Resposta genérica para não revelar se email existe
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        // Verificar bloqueio por tentativas
        if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
            return res.status(429).json({ erro: 'Conta temporariamente bloqueada. Tente novamente mais tarde.' });
        }

        if (!bcrypt.compareSync(senha, usuario.senha)) {
            const novasTentativas = (usuario.tentativas_login || 0) + 1;
            if (novasTentativas >= 5) {
                const bloqueioAte = new Date(Date.now() + 15 * 60 * 1000).toISOString();
                db.run('UPDATE usuarios SET tentativas_login = ?, bloqueado_ate = ? WHERE id = ?',
                    [novasTentativas, bloqueioAte, usuario.id]);
                return res.status(429).json({ erro: 'Conta bloqueada por 15 minutos após muitas tentativas incorretas.' });
            }
            db.run('UPDATE usuarios SET tentativas_login = ? WHERE id = ?', [novasTentativas, usuario.id]);
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        // Login bem-sucedido: zerar tentativas
        db.run('UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?', [usuario.id]);

        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ erro: 'Erro interno' });
            req.session.usuarioId = usuario.id;
            req.session.usuarioNome = usuario.nome;
            req.session.usuarioEmail = usuario.email;
            req.session.usuarioTipo = usuario.tipo;

            res.json({
                mensagem: '✅ Login realizado!',
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipo: usuario.tipo
                }
            });
        });
    });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao encerrar sessão' });
        res.clearCookie('sid');
        res.json({ mensagem: '✅ Logout realizado' });
    });
});

app.get('/api/auth/me', verificarAutenticacao, (req, res) => {
    db.get('SELECT id, nome, email, tipo FROM usuarios WHERE id = ?', [req.session.usuarioId], (err, usuario) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    });
});

// ==================== APLICAR AUTENTICAÇÃO NAS ROTAS DE API ====================
app.use('/api/clientes', verificarAutenticacao);
app.use('/api/servicos', verificarAutenticacao);
app.use('/api/colaboradores', verificarAutenticacao);
app.use('/api/agendamentos', verificarAutenticacao);
app.use('/api/configuracoes', verificarAutenticacao);
app.use('/api/dashboard', verificarAutenticacao);
app.use('/api/aniversariantes', verificarAutenticacao);
app.use('/api/empresa', verificarAutenticacao);

// ==================== ROTAS DE API PROTEGIDAS ====================

// --- CLIENTES ---
app.get('/api/clientes', (req, res) => {
    db.all('SELECT * FROM clientes WHERE usuario_id = ? ORDER BY nome', [req.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        res.json(rows || []);
    });
});

app.post('/api/clientes', (req, res) => {
    const nome = sanitizeString(req.body.nome);
    const email = sanitizeString(req.body.email);
    const telefone = sanitizeString(req.body.telefone);
    const data_nascimento = sanitizeString(req.body.data_nascimento);
    const endereco = sanitizeString(req.body.endereco);

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    if (email && !validarEmail(email)) return res.status(400).json({ erro: 'Email inválido' });

    db.run(
        'INSERT INTO clientes (usuario_id, nome, email, telefone, data_nascimento, endereco) VALUES (?, ?, ?, ?, ?, ?)',
        [req.usuarioId, nome, email, telefone, data_nascimento, endereco],
        function(err) {
            if (err) return res.status(400).json({ erro: 'Erro ao cadastrar cliente' });
            res.json({ mensagem: '✅ Cliente cadastrado!', id: this.lastID });
        }
    );
});

app.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const nome = sanitizeString(req.body.nome);
    const email = sanitizeString(req.body.email);
    const telefone = sanitizeString(req.body.telefone);
    const data_nascimento = sanitizeString(req.body.data_nascimento);
    const endereco = sanitizeString(req.body.endereco);

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    if (email && !validarEmail(email)) return res.status(400).json({ erro: 'Email inválido' });

    // Garante que o cliente pertence ao usuário logado (IDOR fix)
    db.run(
        'UPDATE clientes SET nome=?, email=?, telefone=?, data_nascimento=?, endereco=? WHERE id=? AND usuario_id=?',
        [nome, email, telefone, data_nascimento, endereco, id, req.usuarioId],
        function(err) {
            if (err) return res.status(500).json({ erro: 'Erro interno' });
            if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
            res.json({ mensagem: '✅ Cliente atualizado!' });
        }
    );
});

app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM clientes WHERE id = ? AND usuario_id = ?', [id, req.usuarioId], function(err) {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
        res.json({ mensagem: '✅ Cliente removido!' });
    });
});

// --- SERVIÇOS ---
app.get('/api/servicos', (req, res) => {
    db.all('SELECT * FROM servicos WHERE usuario_id = ? AND ativo = 1 ORDER BY nome', [req.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        res.json(rows || []);
    });
});

app.post('/api/servicos', (req, res) => {
    const nome = sanitizeString(req.body.nome);
    const descricao = sanitizeString(req.body.descricao);
    const preco = parseFloat(req.body.preco) || 0;
    const duracao = parseInt(req.body.duracao) || 0;

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });

    db.run(
        'INSERT INTO servicos (usuario_id, nome, descricao, preco, duracao) VALUES (?, ?, ?, ?, ?)',
        [req.usuarioId, nome, descricao, preco, duracao],
        function(err) {
            if (err) return res.status(400).json({ erro: 'Erro ao cadastrar serviço' });
            res.json({ mensagem: '✅ Serviço cadastrado!', id: this.lastID });
        }
    );
});

app.put('/api/servicos/:id', (req, res) => {
    const { id } = req.params;
    const nome = sanitizeString(req.body.nome);
    const descricao = sanitizeString(req.body.descricao);
    const preco = parseFloat(req.body.preco) || 0;
    const duracao = parseInt(req.body.duracao) || 0;
    const ativo = req.body.ativo !== undefined ? req.body.ativo : 1;

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });

    db.run(
        'UPDATE servicos SET nome=?, descricao=?, preco=?, duracao=?, ativo=? WHERE id=? AND usuario_id=?',
        [nome, descricao, preco, duracao, ativo, id, req.usuarioId],
        function(err) {
            if (err) return res.status(500).json({ erro: 'Erro interno' });
            if (this.changes === 0) return res.status(404).json({ erro: 'Serviço não encontrado' });
            res.json({ mensagem: '✅ Serviço atualizado!' });
        }
    );
});

app.delete('/api/servicos/:id', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE servicos SET ativo = 0 WHERE id = ? AND usuario_id = ?', [id, req.usuarioId], function(err) {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        if (this.changes === 0) return res.status(404).json({ erro: 'Serviço não encontrado' });
        res.json({ mensagem: '✅ Serviço desativado!' });
    });
});

// --- COLABORADORES ---
app.get('/api/colaboradores', (req, res) => {
    db.all('SELECT * FROM colaboradores WHERE usuario_id = ? AND ativo = 1 ORDER BY nome', [req.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        res.json(rows || []);
    });
});

app.post('/api/colaboradores', (req, res) => {
    const nome = sanitizeString(req.body.nome);
    const especialidade = sanitizeString(req.body.especialidade);
    const telefone = sanitizeString(req.body.telefone);
    const email = sanitizeString(req.body.email);
    const descricao = sanitizeString(req.body.descricao);

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    if (email && !validarEmail(email)) return res.status(400).json({ erro: 'Email inválido' });

    db.run(
        'INSERT INTO colaboradores (usuario_id, nome, especialidade, telefone, email, descricao) VALUES (?, ?, ?, ?, ?, ?)',
        [req.usuarioId, nome, especialidade, telefone, email, descricao],
        function(err) {
            if (err) return res.status(400).json({ erro: 'Erro ao cadastrar colaborador' });
            res.json({ id: this.lastID, mensagem: '✅ Colaborador cadastrado!' });
        }
    );
});

app.put('/api/colaboradores/:id', (req, res) => {
    const { id } = req.params;
    const nome = sanitizeString(req.body.nome);
    const especialidade = sanitizeString(req.body.especialidade);
    const telefone = sanitizeString(req.body.telefone);
    const email = sanitizeString(req.body.email);
    const descricao = sanitizeString(req.body.descricao);

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    if (email && !validarEmail(email)) return res.status(400).json({ erro: 'Email inválido' });

    db.run(
        'UPDATE colaboradores SET nome=?, especialidade=?, telefone=?, email=?, descricao=? WHERE id=? AND usuario_id=?',
        [nome, especialidade, telefone, email, descricao, id, req.usuarioId],
        function(err) {
            if (err) return res.status(500).json({ erro: 'Erro interno' });
            if (this.changes === 0) return res.status(404).json({ erro: 'Colaborador não encontrado' });
            res.json({ mensagem: '✅ Colaborador atualizado!' });
        }
    );
});

app.delete('/api/colaboradores/:id', (req, res) => {
    const { id } = req.params;
    db.run('UPDATE colaboradores SET ativo = 0 WHERE id = ? AND usuario_id = ?', [id, req.usuarioId], function(err) {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        if (this.changes === 0) return res.status(404).json({ erro: 'Colaborador não encontrado' });
        res.json({ mensagem: '✅ Colaborador desativado!' });
    });
});

// --- AGENDAMENTOS ---
app.get('/api/agendamentos', (req, res) => {
    const sql = `
        SELECT a.*, c.nome as cliente_nome, c.telefone, c.data_nascimento,
               s.nome as servico_nome, s.preco, col.nome as colaborador_nome
        FROM agendamentos a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN servicos s ON a.servico_id = s.id
        LEFT JOIN colaboradores col ON a.colaborador_id = col.id
        WHERE a.usuario_id = ?
        ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC
    `;
    db.all(sql, [req.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        res.json(rows || []);
    });
});

app.post('/api/agendamentos', (req, res) => {
    const cliente_id = parseInt(req.body.cliente_id);
    const servico_id = parseInt(req.body.servico_id);
    const colaborador_id = req.body.colaborador_id ? parseInt(req.body.colaborador_id) : null;
    const data_agendamento = sanitizeString(req.body.data_agendamento);
    const hora_agendamento = sanitizeString(req.body.hora_agendamento);
    const observacoes = sanitizeString(req.body.observacoes);

    if (!cliente_id || !servico_id || !data_agendamento || !hora_agendamento) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    // Verificar que o cliente pertence ao usuário
    db.get('SELECT id FROM clientes WHERE id = ? AND usuario_id = ?', [cliente_id, req.usuarioId], (err, cliente) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        if (!cliente) return res.status(400).json({ erro: 'Cliente inválido' });

        db.run(
            'INSERT INTO agendamentos (usuario_id, cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.usuarioId, cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes],
            function(err) {
                if (err) return res.status(400).json({ erro: 'Erro ao criar agendamento' });
                res.json({ mensagem: '✅ Agendamento criado!', id: this.lastID });
            }
        );
    });
});

app.put('/api/agendamentos/:id', (req, res) => {
    const { id } = req.params;
    const status = sanitizeString(req.body.status);
    const statusValidos = ['pendente', 'confirmado', 'cancelado', 'concluido'];

    if (status && !statusValidos.includes(status)) {
        return res.status(400).json({ erro: 'Status inválido' });
    }

    db.run(
        'UPDATE agendamentos SET status=? WHERE id=? AND usuario_id=?',
        [status, id, req.usuarioId],
        function(err) {
            if (err) return res.status(500).json({ erro: 'Erro interno' });
            if (this.changes === 0) return res.status(404).json({ erro: 'Agendamento não encontrado' });
            res.json({ mensagem: '✅ Agendamento atualizado!' });
        }
    );
});

// --- DASHBOARD ---
app.get('/api/dashboard', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];
    const dia = new Date().getDate().toString().padStart(2, '0');
    const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');

    db.get(`
        SELECT
            (SELECT COUNT(*) FROM clientes WHERE usuario_id = ?) as total_clientes,
            (SELECT COUNT(*) FROM servicos WHERE usuario_id = ? AND ativo = 1) as total_servicos,
            (SELECT COUNT(*) FROM colaboradores WHERE usuario_id = ? AND ativo = 1) as total_colaboradores,
            (SELECT COUNT(*) FROM agendamentos WHERE usuario_id = ? AND data_agendamento = ?) as agendamentos_hoje,
            (SELECT COUNT(*) FROM agendamentos WHERE usuario_id = ? AND status = 'pendente') as agendamentos_pendentes,
            (SELECT COUNT(*) FROM clientes WHERE usuario_id = ? AND data_nascimento IS NOT NULL AND strftime('%m-%d', data_nascimento) = ?) as aniversariantes_hoje
    `, [
        req.usuarioId, req.usuarioId, req.usuarioId,
        req.usuarioId, hoje, req.usuarioId,
        req.usuarioId, `${mes}-${dia}`
    ], (err, row) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        res.json(row || {
            total_clientes: 0, total_servicos: 0, total_colaboradores: 0,
            agendamentos_hoje: 0, agendamentos_pendentes: 0, aniversariantes_hoje: 0
        });
    });
});

// --- ANIVERSARIANTES ---
app.get('/api/aniversariantes', (req, res) => {
    const mes = req.query.mes ? parseInt(req.query.mes) : (new Date().getMonth() + 1);
    if (mes < 1 || mes > 12) return res.status(400).json({ erro: 'Mês inválido' });
    const mesStr = mes.toString().padStart(2, '0');

    db.all(
        `SELECT id, nome, email, telefone, data_nascimento FROM clientes
         WHERE usuario_id = ? AND data_nascimento IS NOT NULL
         AND strftime('%m', data_nascimento) = ?
         ORDER BY strftime('%d', data_nascimento)`,
        [req.usuarioId, mesStr],
        (err, rows) => {
            if (err) return res.status(500).json({ erro: 'Erro interno' });
            res.json(rows || []);
        }
    );
});

// --- EMPRESA ---
app.get('/api/empresa', (req, res) => {
    db.get('SELECT * FROM empresas WHERE usuario_id = ?', [req.usuarioId], (err, row) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        res.json(row || {});
    });
});

app.put('/api/empresa', (req, res) => {
    const campos = ['nome_empresa','cnpj','inscricao_estadual','atividade','endereco','cidade','estado','cep','telefone','email','site','descricao','cor_primaria','cor_secundaria'];
    const values = campos.map(c => sanitizeString(req.body[c]));

    db.get('SELECT id FROM empresas WHERE usuario_id = ?', [req.usuarioId], (err, row) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });

        if (row) {
            const sets = campos.map(c => `${c}=?`).join(', ');
            db.run(`UPDATE empresas SET ${sets} WHERE usuario_id=?`, [...values, req.usuarioId], function(err) {
                if (err) return res.status(500).json({ erro: 'Erro interno' });
                res.json({ mensagem: '✅ Empresa atualizada!' });
            });
        } else {
            const cols = campos.join(', ');
            const placeholders = campos.map(() => '?').join(', ');
            db.run(`INSERT INTO empresas (usuario_id, ${cols}) VALUES (?, ${placeholders})`, [req.usuarioId, ...values], function(err) {
                if (err) return res.status(500).json({ erro: 'Erro interno' });
                res.json({ mensagem: '✅ Empresa cadastrada!' });
            });
        }
    });
});

// --- CONFIGURAÇÕES ---
app.get('/api/configuracoes', (req, res) => {
    db.all('SELECT chave, valor FROM configuracoes_avancadas WHERE usuario_id = ?', [req.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: 'Erro interno' });
        const config = {};
        (rows || []).forEach(r => { config[r.chave] = r.valor; });
        res.json(config);
    });
});

app.put('/api/configuracoes', (req, res) => {
    const chavesPermitidas = ['notificacao_lembrete_horas','cancelamento_sem_custo_horas',
        'notificar_cliente_lembrete','notificar_empresa_cancelamento','permitir_recorrente','whatsapp_empresa'];

    const updates = [];
    chavesPermitidas.forEach(chave => {
        if (req.body[chave] !== undefined) {
            updates.push([sanitizeString(String(req.body[chave])), req.usuarioId, chave]);
        }
    });

    if (updates.length === 0) return res.status(400).json({ erro: 'Nenhuma configuração válida enviada' });

    let pendentes = updates.length;
    let erro = false;

    updates.forEach(([valor, uid, chave]) => {
        db.run(
            'INSERT INTO configuracoes_avancadas (usuario_id, chave, valor) VALUES (?, ?, ?) ON CONFLICT(usuario_id, chave) DO UPDATE SET valor=excluded.valor',
            [uid, chave, valor],
            function(err) {
                if (err && !erro) { erro = true; return res.status(500).json({ erro: 'Erro interno' }); }
                pendentes--;
                if (pendentes === 0 && !erro) res.json({ mensagem: '✅ Configurações salvas!' });
            }
        );
    });
});

// ==================== ROTAS DE PÁGINAS PROTEGIDAS ====================
app.get('/', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const paginasProtegidas = {
    '/clientes': 'pages/clientes.html',
    '/agendamentos': 'pages/agendamentos.html',
    '/servicos': 'pages/servicos.html',
    '/colaboradores': 'pages/colaboradores.html',
    '/configuracoes': 'configuracoes.html',
    '/configuracoes-avancadas': 'configuracoes_avancadas.html',
    '/empresa': 'empresa.html',
    '/aniversariantes': 'aniversariantes.html'
};

Object.entries(paginasProtegidas).forEach(([rota, arquivo]) => {
    app.get(rota, verificarAutenticacao, (req, res) => {
        const filePath = path.join(__dirname, 'public', arquivo);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('Página não encontrada');
        }
        res.sendFile(filePath);
    });
});

// ==================== 404 PARA ROTAS DE API DESCONHECIDAS ====================
app.use('/api/', (req, res) => {
    res.status(404).json({ erro: 'Endpoint não encontrado' });
});

// ==================== TRATAMENTO DE ERRO GLOBAL ====================
app.use((err, req, res, next) => {
    // Não vazar detalhes do erro em produção
    const mensagem = NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message;
    if (req.path.startsWith('/api/')) {
        res.status(500).json({ erro: mensagem });
    } else {
        res.status(500).send('Erro interno do servidor');
    }
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
    db.close();
    process.exit(0);
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT} [${NODE_ENV}]`);
});
