const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: './data' }),
    secret: 'agendapro-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, 'public')));

// ==================== BANCO DE DADOS ====================
// Garantir que a pasta data existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'agendamento.db');
console.log(`📁 Banco de dados: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err.message);
    } else {
        console.log('✅ Conectado ao banco SQLite');
    }
});

// ==================== CRIAÇÃO DAS TABELAS ====================
db.serialize(() => {
    // Tabela de usuários (gestores)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        cargo TEXT,
        ativo BOOLEAN DEFAULT 1,
        tipo TEXT DEFAULT 'gestor',
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar usuarios:', err.message);
    });

    // Tabela de empresas
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
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar empresas:', err.message);
    });

    // Tabela de clientes com data de nascimento
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        data_nascimento DATE,
        endereco TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar clientes:', err.message);
    });

    // Tabela de serviços
    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2),
        duracao INTEGER,
        ativo BOOLEAN DEFAULT 1,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar servicos:', err.message);
    });

    // Tabela de colaboradores
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
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar colaboradores:', err.message);
    });

    // Tabela de vínculo colaborador-serviço
    db.run(`CREATE TABLE IF NOT EXISTS colaborador_servico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        colaborador_id INTEGER,
        servico_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id),
        UNIQUE(colaborador_id, servico_id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar colaborador_servico:', err.message);
    });

    // Tabela de agendamentos
    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
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
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id),
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar agendamentos:', err.message);
    });

    // Tabela de configurações avançadas
    db.run(`CREATE TABLE IF NOT EXISTS configuracoes_avancadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        chave TEXT NOT NULL,
        valor TEXT NOT NULL,
        descricao TEXT,
        UNIQUE(usuario_id, chave),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`, (err) => {
        if (err) console.error('❌ Erro ao criar configuracoes_avancadas:', err.message);
    });

    // ==================== DADOS INICIAIS ====================

    // Inserir usuário admin padrão
    db.get("SELECT COUNT(*) as count FROM usuarios WHERE email = 'admin@agendapro.com'", [], (err, row) => {
        if (err) {
            console.error('❌ Erro ao verificar admin:', err.message);
            return;
        }
        if (row.count === 0) {
            const senhaHash = bcrypt.hashSync('admin123', 10);
            db.run(
                'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                ['Administrador', 'admin@agendapro.com', senhaHash, 'admin'],
                function(err) {
                    if (err) {
                        console.error('❌ Erro ao criar admin:', err.message);
                    } else {
                        console.log('✅ Usuário admin criado: admin@agendapro.com / admin123');
                    }
                }
            );
        }
    });

    // Configurações padrão
    const configsPadrao = [
        ['notificacao_lembrete_horas', '24'],
        ['cancelamento_sem_custo_horas', '2'],
        ['notificar_cliente_lembrete', 'sim'],
        ['notificar_empresa_cancelamento', 'sim'],
        ['permitir_recorrente', 'sim'],
        ['whatsapp_empresa', '5511999999999']
    ];

    configsPadrao.forEach(([chave, valor]) => {
        db.get("SELECT COUNT(*) as count FROM configuracoes_avancadas WHERE chave = ?", [chave], (err, row) => {
            if (!err && row.count === 0) {
                db.run('INSERT INTO configuracoes_avancadas (chave, valor) VALUES (?, ?)', [chave, valor]);
            }
        });
    });

    // Serviços padrão
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
            console.log('✅ Serviços padrão criados');
        }
    });

    // Colaboradores de exemplo
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
            console.log('✅ Colaboradores de exemplo criados');
        }
    });
});

// ==================== ROTA DE DIAGNÓSTICO ====================
app.get('/api/diagnostico', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        
        // Contar registros em cada tabela
        const promessas = tables.map(t => {
            return new Promise((resolve) => {
                db.get(`SELECT COUNT(*) as count FROM ${t.name}`, [], (err, row) => {
                    resolve({ tabela: t.name, registros: row ? row.count : 0 });
                });
            });
        });

        Promise.all(promessas).then((contagens) => {
            res.json({
                status: 'online',
                banco: dbPath,
                tabelas: contagens,
                mensagem: 'Diagnóstico concluído'
            });
        });
    });
});

// ==================== MIDDLEWARE DE AUTENTICAÇÃO ====================
function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.usuarioId) {
        req.usuarioId = req.session.usuarioId;
        req.usuarioTipo = req.session.usuarioTipo;
        next();
    } else {
        if (req.path.startsWith('/api/')) {
            res.status(401).json({ erro: 'Não autenticado' });
        } else {
            res.redirect('/login.html');
        }
    }
}

// ==================== ROTAS PÚBLICAS ====================
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente', 'index.html'));
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================
app.post('/api/auth/cadastro', (req, res) => {
    const { nome, email, senha, telefone, nome_empresa, cnpj, atividade } = req.body;

    if (!nome || !email || !senha || !nome_empresa) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (row) return res.status(400).json({ erro: 'Email já cadastrado' });

        const senhaHash = bcrypt.hashSync(senha, 10);

        db.run(
            'INSERT INTO usuarios (nome, email, senha, telefone, tipo) VALUES (?, ?, ?, ?, ?)',
            [nome, email, senhaHash, telefone, 'gestor'],
            function(err) {
                if (err) return res.status(500).json({ erro: err.message });

                const usuarioId = this.lastID;

                db.run(
                    `INSERT INTO empresas (usuario_id, nome_empresa, cnpj, atividade) VALUES (?, ?, ?, ?)`,
                    [usuarioId, nome_empresa, cnpj, atividade],
                    function(err) {
                        if (err) return res.status(500).json({ erro: err.message });

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

app.post('/api/auth/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' });

    db.get('SELECT * FROM usuarios WHERE email = ? AND ativo = 1', [email], (err, usuario) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!usuario) return res.status(401).json({ erro: 'Email ou senha inválidos' });

        if (!bcrypt.compareSync(senha, usuario.senha)) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

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

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ mensagem: '✅ Logout realizado' });
});

app.get('/api/auth/me', (req, res) => {
    if (!req.session || !req.session.usuarioId) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }
    db.get('SELECT id, nome, email, tipo FROM usuarios WHERE id = ?', [req.session.usuarioId], (err, usuario) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(usuario);
    });
});

// ==================== ROTAS PROTEGIDAS ====================
app.use('/api/clientes', verificarAutenticacao);
app.use('/api/servicos', verificarAutenticacao);
app.use('/api/colaboradores', verificarAutenticacao);
app.use('/api/agendamentos', verificarAutenticacao);
app.use('/api/configuracoes', verificarAutenticacao);
app.use('/api/dashboard', verificarAutenticacao);
app.use('/api/aniversariantes', verificarAutenticacao);
app.use('/api/empresa', verificarAutenticacao);

// ==================== ROTAS DE CLIENTES ====================
app.get('/api/clientes', (req, res) => {
    db.all('SELECT * FROM clientes WHERE usuario_id = ? ORDER BY nome', [req.session.usuarioId], (err, rows) => {
        if (err) {
            console.error('❌ Erro em /api/clientes:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows || []);
    });
});

app.post('/api/clientes', (req, res) => {
    const { nome, email, telefone, data_nascimento, endereco } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Nome e email obrigatórios' });
    
    db.run(
        'INSERT INTO clientes (usuario_id, nome, email, telefone, data_nascimento, endereco) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.usuarioId, nome, email, telefone, data_nascimento, endereco],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar cliente:', err.message);
                return res.status(400).json({ erro: err.message });
            }
            res.json({ mensagem: '✅ Cliente cadastrado!', id: this.lastID });
        }
    );
});

app.put('/api/clientes/:id', (req, res) => {
    const { nome, email, telefone, data_nascimento, endereco } = req.body;
    db.run(
        'UPDATE clientes SET nome = ?, email = ?, telefone = ?, data_nascimento = ?, endereco = ? WHERE id = ? AND usuario_id = ?',
        [nome, email, telefone, data_nascimento, endereco, req.params.id, req.session.usuarioId],
        function(err) {
            if (err) {
                console.error('❌ Erro ao atualizar cliente:', err.message);
                return res.status(400).json({ erro: err.message });
            }
            if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
            res.json({ mensagem: '✅ Cliente atualizado!' });
        }
    );
});

app.delete('/api/clientes/:id', (req, res) => {
    db.run('DELETE FROM clientes WHERE id = ? AND usuario_id = ?', [req.params.id, req.session.usuarioId], function(err) {
        if (err) {
            console.error('❌ Erro ao deletar cliente:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
        res.json({ mensagem: '✅ Cliente deletado!' });
    });
});

// ==================== ROTAS DE SERVIÇOS ====================
app.get('/api/servicos', (req, res) => {
    db.all('SELECT * FROM servicos WHERE usuario_id = ? AND ativo = 1 ORDER BY nome', [req.session.usuarioId], (err, rows) => {
        if (err) {
            console.error('❌ Erro em /api/servicos:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        // GARANTIR que sempre retorne um array
        res.json(rows || []);
    });
});

app.post('/api/servicos', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    
    db.run(
        'INSERT INTO servicos (usuario_id, nome, descricao, preco, duracao) VALUES (?, ?, ?, ?, ?)',
        [req.session.usuarioId, nome, descricao, preco, duracao],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar serviço:', err.message);
                return res.status(400).json({ erro: err.message });
            }
            res.json({ mensagem: '✅ Serviço cadastrado!', id: this.lastID });
        }
    );
});

// ==================== ROTAS DE COLABORADORES ====================
app.get('/api/colaboradores', (req, res) => {
    db.all('SELECT * FROM colaboradores WHERE usuario_id = ? AND ativo = 1 ORDER BY nome', [req.session.usuarioId], (err, rows) => {
        if (err) {
            console.error('❌ Erro em /api/colaboradores:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows || []);
    });
});
app.post('/api/colaboradores', (req, res) => {
    const { nome, especialidade, telefone, email, descricao } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    
    db.run(
        'INSERT INTO colaboradores (usuario_id, nome, especialidade, telefone, email, descricao) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.usuarioId, nome, especialidade, telefone, email, descricao],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar colaborador:', err.message);
                return res.status(400).json({ erro: err.message });
            }
            res.json({ id: this.lastID, mensagem: '✅ Colaborador cadastrado!' });
        }
    );
});

// ==================== ROTAS DE AGENDAMENTOS ====================
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
    db.all(sql, [req.session.usuarioId], (err, rows) => {
        if (err) {
            console.error('❌ Erro em /api/agendamentos:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows || []);
    });
});

app.post('/api/agendamentos', (req, res) => {
    const { cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes, tipo_agendamento, recorrencia, data_fim_recorrencia } = req.body;
    
    if (!cliente_id || !servico_id || !data_agendamento || !hora_agendamento) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    db.run(
        `INSERT INTO agendamentos 
         (usuario_id, cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes, tipo_agendamento, recorrencia, data_fim_recorrencia) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.session.usuarioId, cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes, tipo_agendamento || 'unico', recorrencia, data_fim_recorrencia],
        function(err) {
            if (err) {
                console.error('❌ Erro ao criar agendamento:', err.message);
                return res.status(400).json({ erro: err.message });
            }
            res.json({ mensagem: '✅ Agendamento realizado!', id: this.lastID });
        }
    );
});

// ==================== ROTAS DE ANIVERSARIANTES ====================
app.get('/api/aniversariantes/hoje', (req, res) => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');

    db.all(
        `SELECT * FROM clientes 
         WHERE usuario_id = ? 
         AND data_nascimento IS NOT NULL 
         AND strftime('%m-%d', data_nascimento) = ? 
         ORDER BY nome`,
        [req.session.usuarioId, `${mes}-${dia}`],
        (err, rows) => {
            if (err) {
                console.error('❌ Erro em /api/aniversariantes/hoje:', err.message);
                return res.status(500).json({ erro: err.message });
            }
            res.json(rows || []);
        }
    );
});

// ==================== ROTAS DE CONFIGURAÇÕES ====================
app.get('/api/configuracoes/:chave', (req, res) => {
    db.get(
        'SELECT valor FROM configuracoes_avancadas WHERE usuario_id = ? AND chave = ?',
        [req.session.usuarioId, req.params.chave],
        (err, row) => {
            if (err) {
                console.error('❌ Erro ao buscar configuração:', err.message);
                return res.status(500).json({ erro: err.message });
            }
            res.json(row || { valor: '' });
        }
    );
});

app.post('/api/configuracoes', (req, res) => {
    const { chave, valor } = req.body;
    db.run(
        'UPDATE configuracoes_avancadas SET valor = ? WHERE usuario_id = ? AND chave = ?',
        [valor, req.session.usuarioId, chave],
        function(err) {
            if (err) {
                console.error('❌ Erro ao salvar configuração:', err.message);
                return res.status(500).json({ erro: err.message });
            }
            if (this.changes === 0) {
                db.run(
                    'INSERT INTO configuracoes_avancadas (usuario_id, chave, valor) VALUES (?, ?, ?)',
                    [req.session.usuarioId, chave, valor]
                );
            }
            res.json({ mensagem: '✅ Configuração salva!' });
        }
    );
});

// ==================== ROTAS DE DASHBOARD ====================
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
        req.session.usuarioId, req.session.usuarioId, req.session.usuarioId, 
        req.session.usuarioId, hoje, req.session.usuarioId,
        req.session.usuarioId, `${mes}-${dia}`
    ], (err, row) => {
        if (err) {
            console.error('❌ Erro em /api/dashboard:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        res.json(row || {
            total_clientes: 0,
            total_servicos: 0,
            total_colaboradores: 0,
            agendamentos_hoje: 0,
            agendamentos_pendentes: 0,
            aniversariantes_hoje: 0
        });
    });
});

// ==================== ROTAS DE EMPRESA ====================
app.get('/api/empresa', (req, res) => {
    db.get('SELECT * FROM empresas WHERE usuario_id = ?', [req.session.usuarioId], (err, row) => {
        if (err) {
            console.error('❌ Erro em /api/empresa:', err.message);
            return res.status(500).json({ erro: err.message });
        }
        res.json(row || {});
    });
});

// ==================== ROTAS DE PÁGINAS PROTEGIDAS ====================
app.get('/', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/clientes', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'clientes.html'));
});

app.get('/agendamentos', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'agendamentos.html'));
});

app.get('/servicos', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'servicos.html'));
});

app.get('/colaboradores', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'colaboradores.html'));
});

app.get('/configuracoes', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'configuracoes.html'));
});

app.get('/configuracoes-avancadas', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'configuracoes_avancadas.html'));
});

app.get('/empresa', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'empresa.html'));
});

app.get('/aniversariantes', verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aniversariantes.html'));
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   🏛️  SISTEMA DE AGENDAMENTO v5.0        ║
    ║                                          ║
    ║  🚀 Servidor: http://localhost:${PORT}     ║
    ║  🔐 Login: http://localhost:${PORT}/login.html ║
    ║  🎂 Aniversariantes: ✓ Ativo             ║
    ║  📊 Diagnóstico: /api/diagnostico        ║
    ║                                          ║
    ║  ✅ Sistema completo com autenticação!   ║
    ╚══════════════════════════════════════════╝
    `);
});