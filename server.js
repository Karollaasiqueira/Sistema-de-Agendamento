const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

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
const db = new sqlite3.Database(path.join(__dirname, 'data', 'agendamento.db'));

db.serialize(() => {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            telefone TEXT,
            cargo TEXT,
            ativo BOOLEAN DEFAULT 1,
            tipo TEXT DEFAULT 'gestor',
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de empresas
    db.run(`
        CREATE TABLE IF NOT EXISTS empresas (
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
        )
    `);

    // Tabela de clientes (COM DATA DE NASCIMENTO)
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefone TEXT,
            data_nascimento DATE,
            endereco TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);

    // Tabela de serviços
    db.run(`
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco DECIMAL(10,2),
            duracao INTEGER,
            ativo BOOLEAN DEFAULT 1,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);

    // Tabela de colaboradores
    db.run(`
        CREATE TABLE IF NOT EXISTS colaboradores (
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
        )
    `);

    // Tabela de vínculo colaborador-serviço
    db.run(`
        CREATE TABLE IF NOT EXISTS colaborador_servico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            colaborador_id INTEGER,
            servico_id INTEGER,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id),
            FOREIGN KEY (servico_id) REFERENCES servicos(id),
            UNIQUE(colaborador_id, servico_id)
        )
    `);

    // Tabela de agendamentos
    db.run(`
        CREATE TABLE IF NOT EXISTS agendamentos (
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
        )
    `);

    // Tabela de configurações
    db.run(`
        CREATE TABLE IF NOT EXISTS configuracoes_avancadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            chave TEXT NOT NULL,
            valor TEXT NOT NULL,
            descricao TEXT,
            UNIQUE(usuario_id, chave),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);

    // Inserir usuário admin padrão
    db.get("SELECT COUNT(*) as count FROM usuarios WHERE email = 'admin@agendapro.com'", [], (err, row) => {
        if (row.count === 0) {
            const senhaHash = bcrypt.hashSync('admin123', 10);
            db.run(
                'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                ['Administrador', 'admin@agendapro.com', senhaHash, 'admin']
            );
            console.log('✅ Usuário padrão criado: admin@agendapro.com / admin123');
        }
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

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha obrigatórios' });
    }

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

// ==================== CLIENTES (COM DATA DE NASCIMENTO) ====================
app.get('/api/clientes', (req, res) => {
    db.all('SELECT * FROM clientes WHERE usuario_id = ? ORDER BY nome', [req.session.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/clientes', (req, res) => {
    const { nome, email, telefone, data_nascimento, endereco } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Nome e email obrigatórios' });
    
    db.run(
        'INSERT INTO clientes (usuario_id, nome, email, telefone, data_nascimento, endereco) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.usuarioId, nome, email, telefone, data_nascimento, endereco],
        function(err) {
            if (err) return res.status(400).json({ erro: err.message });
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
            if (err) return res.status(400).json({ erro: err.message });
            if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
            res.json({ mensagem: '✅ Cliente atualizado!' });
        }
    );
});

app.delete('/api/clientes/:id', (req, res) => {
    db.run('DELETE FROM clientes WHERE id = ? AND usuario_id = ?', [req.params.id, req.session.usuarioId], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
        res.json({ mensagem: '✅ Cliente deletado!' });
    });
});

// ==================== ANIVERSARIANTES ====================
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
            if (err) return res.status(500).json({ erro: err.message });
            res.json(rows);
        }
    );
});

app.get('/api/aniversariantes/mes/:mes', (req, res) => {
    const mes = req.params.mes.padStart(2, '0');

    db.all(
        `SELECT * FROM clientes 
         WHERE usuario_id = ? 
         AND data_nascimento IS NOT NULL 
         AND strftime('%m', data_nascimento) = ? 
         ORDER BY strftime('%d', data_nascimento), nome`,
        [req.session.usuarioId, mes],
        (err, rows) => {
            if (err) return res.status(500).json({ erro: err.message });
            res.json(rows);
        }
    );
});

app.get('/api/aniversariantes/proximos/:dias', (req, res) => {
    const dias = parseInt(req.params.dias) || 30;
    
    db.all(
        `SELECT * FROM clientes 
         WHERE usuario_id = ? 
         AND data_nascimento IS NOT NULL 
         ORDER BY 
           CASE 
             WHEN strftime('%m-%d', data_nascimento) >= strftime('%m-%d', 'now') 
             THEN strftime('%m-%d', data_nascimento)
             ELSE strftime('%m-%d', data_nascimento, '+1 year')
           END
         LIMIT ?`,
        [req.session.usuarioId, dias],
        (err, rows) => {
            if (err) return res.status(500).json({ erro: err.message });
            res.json(rows);
        }
    );
});

// ==================== SERVIÇOS ====================
app.get('/api/servicos', (req, res) => {
    db.all('SELECT * FROM servicos WHERE usuario_id = ? AND ativo = 1 ORDER BY nome', [req.session.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/servicos', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    
    db.run(
        'INSERT INTO servicos (usuario_id, nome, descricao, preco, duracao) VALUES (?, ?, ?, ?, ?)',
        [req.session.usuarioId, nome, descricao, preco, duracao],
        function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Serviço cadastrado!', id: this.lastID });
        }
    );
});

app.put('/api/servicos/:id', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    db.run(
        'UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao = ? WHERE id = ? AND usuario_id = ?',
        [nome, descricao, preco, duracao, req.params.id, req.session.usuarioId],
        function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            if (this.changes === 0) return res.status(404).json({ erro: 'Serviço não encontrado' });
            res.json({ mensagem: '✅ Serviço atualizado!' });
        }
    );
});

app.put('/api/servicos/:id/toggle', (req, res) => {
    db.run(
        'UPDATE servicos SET ativo = NOT ativo WHERE id = ? AND usuario_id = ?',
        [req.params.id, req.session.usuarioId],
        function(err) {
            if (err) return res.status(500).json({ erro: err.message });
            if (this.changes === 0) return res.status(404).json({ erro: 'Serviço não encontrado' });
            res.json({ mensagem: '✅ Status do serviço alterado!' });
        }
    );
});

// ==================== COLABORADORES ====================
app.get('/api/colaboradores', (req, res) => {
    db.all('SELECT * FROM colaboradores WHERE usuario_id = ? AND ativo = 1 ORDER BY nome', [req.session.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/colaboradores', (req, res) => {
    const { nome, especialidade, telefone, email, descricao } = req.body;
    db.run(
        'INSERT INTO colaboradores (usuario_id, nome, especialidade, telefone, email, descricao) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.usuarioId, nome, especialidade, telefone, email, descricao],
        function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ id: this.lastID, mensagem: '✅ Colaborador cadastrado!' });
        }
    );
});

app.post('/api/colaborador-servico', (req, res) => {
    const { colaborador_id, servico_id } = req.body;
    db.run(
        'INSERT OR IGNORE INTO colaborador_servico (usuario_id, colaborador_id, servico_id) VALUES (?, ?, ?)',
        [req.session.usuarioId, colaborador_id, servico_id],
        function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Serviço vinculado ao colaborador!' });
        }
    );
});

app.get('/api/servico/:id/colaboradores', (req, res) => {
    db.all(`
        SELECT c.* FROM colaboradores c
        JOIN colaborador_servico cs ON c.id = cs.colaborador_id
        WHERE cs.servico_id = ? AND c.usuario_id = ? AND c.ativo = 1
    `, [req.params.id, req.session.usuarioId], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// ==================== AGENDAMENTOS ====================
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
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
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
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Agendamento realizado!', id: this.lastID });
        }
    );
});

app.put('/api/agendamentos/:id/cancelar', (req, res) => {
    const { motivo, cancelado_por } = req.body;
    const id = req.params.id;

    db.get('SELECT valor FROM configuracoes_avancadas WHERE usuario_id = ? AND chave = ?', 
        [req.session.usuarioId, 'cancelamento_sem_custo_horas'], 
        (err, config) => {
            const horasLimite = config ? parseInt(config.valor) : 2;
            
            db.get('SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?', [id, req.session.usuarioId], (err, agendamento) => {
                if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
                
                const dataAgendamento = new Date(agendamento.data_agendamento + 'T' + agendamento.hora_agendamento);
                const agora = new Date();
                const diffHoras = (dataAgendamento - agora) / (1000 * 60 * 60);
                const temCusto = cancelado_por === 'cliente' && diffHoras < horasLimite;

                db.run(
                    `UPDATE agendamentos SET status = 'cancelado', cancelado_em = CURRENT_TIMESTAMP, 
                     motivo_cancelamento = ?, cancelado_por = ?, cancelamento_com_custo = ? 
                     WHERE id = ? AND usuario_id = ?`,
                    [motivo, cancelado_por, temCusto ? 1 : 0, id, req.session.usuarioId],
                    function(err) {
                        if (err) return res.status(500).json({ erro: err.message });
                        res.json({
                            mensagem: '✅ Agendamento cancelado!',
                            tem_custo: temCusto,
                            aviso: temCusto ? 'Cancelamento fora do prazo, pode gerar custo.' : 'Cancelamento dentro do prazo.'
                        });
                    }
                );
            });
        }
    );
});

app.get('/api/agendamentos/telefone/:telefone', (req, res) => {
    const sql = `
        SELECT a.*, s.nome as servico_nome, s.preco, col.nome as colaborador_nome
        FROM agendamentos a
        LEFT JOIN servicos s ON a.servico_id = s.id
        LEFT JOIN colaboradores col ON a.colaborador_id = col.id
        WHERE a.usuario_id = ? AND a.cliente_id IN (SELECT id FROM clientes WHERE telefone = ?)
        ORDER BY a.data_agendamento DESC
    `;
    db.all(sql, [req.session.usuarioId, req.params.telefone], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// ==================== CONFIGURAÇÕES ====================
app.get('/api/configuracoes/:chave', (req, res) => {
    db.get(
        'SELECT valor FROM configuracoes_avancadas WHERE usuario_id = ? AND chave = ?',
        [req.session.usuarioId, req.params.chave],
        (err, row) => {
            if (err) return res.status(500).json({ erro: err.message });
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
            if (err) return res.status(500).json({ erro: err.message });
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

// ==================== DASHBOARD ====================
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
        if (err) return res.status(500).json({ erro: err.message });
        res.json(row);
    });
});

// ==================== DADOS DA EMPRESA ====================
app.get('/api/empresa', (req, res) => {
    db.get('SELECT * FROM empresas WHERE usuario_id = ?', [req.session.usuarioId], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(row || {});
    });
});

app.put('/api/empresa', (req, res) => {
    const { nome_empresa, cnpj, inscricao_estadual, atividade, endereco, cidade, estado, cep, telefone, email, site, descricao } = req.body;
    db.run(
        `UPDATE empresas SET 
         nome_empresa = ?, cnpj = ?, inscricao_estadual = ?, atividade = ?, 
         endereco = ?, cidade = ?, estado = ?, cep = ?, telefone = ?, email = ?, site = ?, descricao = ?
         WHERE usuario_id = ?`,
        [nome_empresa, cnpj, inscricao_estadual, atividade, endereco, cidade, estado, cep, telefone, email, site, descricao, req.session.usuarioId],
        function(err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.json({ mensagem: '✅ Dados da empresa atualizados!' });
        }
    );
});

// ==================== ROTAS DE PÁGINAS ====================
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
    ║                                          ║
    ║  ✅ Sistema completo com autenticação!   ║
    ╚══════════════════════════════════════════╝
    `);
});