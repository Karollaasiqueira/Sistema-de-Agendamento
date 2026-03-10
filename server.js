const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(path.join(__dirname, 'data', 'agendamento.db'));

db.serialize(() => {
    // Tabelas base
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone TEXT,
        endereco TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2),
        duracao INTEGER,
        ativo BOOLEAN DEFAULT 1
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS colaboradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especialidade TEXT,
        telefone TEXT,
        email TEXT,
        ativo BOOLEAN DEFAULT 1,
        foto TEXT,
        descricao TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS colaborador_servico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        colaborador_id INTEGER,
        servico_id INTEGER,
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id),
        UNIQUE(colaborador_id, servico_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS configuracoes_avancadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chave TEXT UNIQUE NOT NULL,
        valor TEXT NOT NULL,
        descricao TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id),
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id)
    )`);

    // Configurações padrão
    const configs = [
        ['notificacao_lembrete_horas', '24', 'Horas antes do agendamento para enviar lembrete'],
        ['cancelamento_sem_custo_horas', '2', 'Horas antes que o cliente pode cancelar sem custo'],
        ['notificar_cliente_lembrete', 'sim', 'Enviar lembrete para o cliente'],
        ['notificar_empresa_cancelamento', 'sim', 'Notificar empresa quando cliente cancelar'],
        ['permitir_recorrente', 'sim', 'Permitir agendamentos recorrentes'],
        ['whatsapp_empresa', '5511999999999', 'Número de WhatsApp da empresa']
    ];

    configs.forEach(([chave, valor, descricao]) => {
        db.get('SELECT COUNT(*) as count FROM configuracoes_avancadas WHERE chave = ?', [chave], (err, row) => {
            if (row.count === 0) {
                db.run('INSERT INTO configuracoes_avancadas (chave, valor, descricao) VALUES (?, ?, ?)', [chave, valor, descricao]);
            }
        });
    });

    // Serviços padrão
    db.get('SELECT COUNT(*) as count FROM servicos', [], (err, row) => {
        if (row.count === 0) {
            const servicos = [
                ['Consulta Simples', 'Consulta básica', 100.00, 30],
                ['Consulta Completa', 'Consulta com exames', 200.00, 60],
                ['Procedimento', 'Procedimento simples', 300.00, 90],
                ['Retorno', 'Consulta de retorno', 80.00, 20]
            ];
            servicos.forEach(s => db.run('INSERT INTO servicos (nome, descricao, preco, duracao) VALUES (?, ?, ?, ?)', s));
        }
    });

    // Colaboradores de exemplo
    db.get('SELECT COUNT(*) as count FROM colaboradores', [], (err, row) => {
        if (row.count === 0) {
            const cols = [
                ['Ana Silva', 'Massoterapeuta', '11988887777', 'ana@exemplo.com', 'Especialista em massagem relaxante'],
                ['Carlos Santos', 'Quiroprata', '11977776666', 'carlos@exemplo.com', 'Quiroprata com 10 anos de experiência'],
                ['Mariana Costa', 'Esteticista', '11966665555', 'mariana@exemplo.com', 'Especialista em limpeza de pele']
            ];
            cols.forEach(c => db.run('INSERT INTO colaboradores (nome, especialidade, telefone, email, descricao) VALUES (?, ?, ?, ?, ?)', c));
        }
    });

    // Vínculos exemplo
    db.get('SELECT COUNT(*) as count FROM colaborador_servico', [], (err, row) => {
        if (row.count === 0) {
            const vinculos = [[1,1], [1,2], [2,3], [3,4]];
            vinculos.forEach(v => db.run('INSERT OR IGNORE INTO colaborador_servico (colaborador_id, servico_id) VALUES (?, ?)', v));
        }
    });
});

// ==================== CONFIGURAÇÕES ====================
app.get('/api/configuracoes/:chave', (req, res) => {
    db.get('SELECT valor FROM configuracoes_avancadas WHERE chave = ?', [req.params.chave], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(row || { valor: '' });
    });
});

app.post('/api/configuracoes', (req, res) => {
    const { chave, valor } = req.body;
    db.run('UPDATE configuracoes_avancadas SET valor = ? WHERE chave = ?', [valor, chave], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ mensagem: '✅ Configuração salva!' });
    });
});

// ==================== CLIENTES ====================
app.get('/api/clientes', (req, res) => {
    db.all('SELECT * FROM clientes ORDER BY nome', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/clientes', (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Nome e email obrigatórios' });
    db.run('INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
        [nome, email, telefone, endereco], function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Cliente cadastrado!', id: this.lastID });
        });
});

app.put('/api/clientes/:id', (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    db.run('UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
        [nome, email, telefone, endereco, req.params.id], function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
            res.json({ mensagem: '✅ Cliente atualizado!' });
        });
});

app.delete('/api/clientes/:id', (req, res) => {
    db.run('DELETE FROM clientes WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        if (this.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
        res.json({ mensagem: '✅ Cliente deletado!' });
    });
});

// ==================== SERVIÇOS ====================
app.get('/api/servicos', (req, res) => {
    db.all('SELECT * FROM servicos WHERE ativo = 1 ORDER BY nome', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/servicos', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
    db.run('INSERT INTO servicos (nome, descricao, preco, duracao) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, duracao], function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Serviço cadastrado!', id: this.lastID });
        });
});

app.put('/api/servicos/:id', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    db.run('UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao = ? WHERE id = ?',
        [nome, descricao, preco, duracao, req.params.id], function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            if (this.changes === 0) return res.status(404).json({ erro: 'Serviço não encontrado' });
            res.json({ mensagem: '✅ Serviço atualizado!' });
        });
});

app.put('/api/servicos/:id/toggle', (req, res) => {
    db.run('UPDATE servicos SET ativo = NOT ativo WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        if (this.changes === 0) return res.status(404).json({ erro: 'Serviço não encontrado' });
        res.json({ mensagem: '✅ Status do serviço alterado!' });
    });
});

// ==================== COLABORADORES ====================
app.get('/api/colaboradores', (req, res) => {
    db.all('SELECT * FROM colaboradores WHERE ativo = 1 ORDER BY nome', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/colaboradores', (req, res) => {
    const { nome, especialidade, telefone, email, descricao } = req.body;
    db.run('INSERT INTO colaboradores (nome, especialidade, telefone, email, descricao) VALUES (?, ?, ?, ?, ?)',
        [nome, especialidade, telefone, email, descricao], function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ id: this.lastID, mensagem: '✅ Colaborador cadastrado!' });
        });
});

app.post('/api/colaborador-servico', (req, res) => {
    const { colaborador_id, servico_id } = req.body;
    db.run('INSERT OR IGNORE INTO colaborador_servico (colaborador_id, servico_id) VALUES (?, ?)',
        [colaborador_id, servico_id], function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Serviço vinculado ao colaborador!' });
        });
});

app.get('/api/servico/:id/colaboradores', (req, res) => {
    db.all(`
        SELECT c.* FROM colaboradores c
        JOIN colaborador_servico cs ON c.id = cs.colaborador_id
        WHERE cs.servico_id = ? AND c.ativo = 1
    `, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// ==================== AGENDAMENTOS ====================
app.get('/api/agendamentos', (req, res) => {
    const sql = `
        SELECT a.*, c.nome as cliente_nome, c.telefone, s.nome as servico_nome, s.preco, col.nome as colaborador_nome
        FROM agendamentos a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN servicos s ON a.servico_id = s.id
        LEFT JOIN colaboradores col ON a.colaborador_id = col.id
        ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC
    `;
    db.all(sql, [], (err, rows) => {
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
         (cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes, tipo_agendamento, recorrencia, data_fim_recorrencia) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cliente_id, servico_id, colaborador_id, data_agendamento, hora_agendamento, observacoes, tipo_agendamento || 'unico', recorrencia, data_fim_recorrencia],
        function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ mensagem: '✅ Agendamento realizado!', id: this.lastID });
        }
    );
});

app.put('/api/agendamentos/:id/cancelar', (req, res) => {
    const { motivo, cancelado_por } = req.body;
    const id = req.params.id;

    db.get('SELECT valor FROM configuracoes_avancadas WHERE chave = ?', ['cancelamento_sem_custo_horas'], (err, config) => {
        const horasLimite = config ? parseInt(config.valor) : 2;
        db.get('SELECT * FROM agendamentos WHERE id = ?', [id], (err, agendamento) => {
            if (!agendamento) return res.status(404).json({ erro: 'Agendamento não encontrado' });
            const dataAgendamento = new Date(agendamento.data_agendamento + 'T' + agendamento.hora_agendamento);
            const agora = new Date();
            const diffHoras = (dataAgendamento - agora) / (1000 * 60 * 60);
            const temCusto = cancelado_por === 'cliente' && diffHoras < horasLimite;

            db.run(
                `UPDATE agendamentos SET status = 'cancelado', cancelado_em = CURRENT_TIMESTAMP, motivo_cancelamento = ?, cancelado_por = ?, cancelamento_com_custo = ? WHERE id = ?`,
                [motivo, cancelado_por, temCusto ? 1 : 0, id],
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
    });
});

app.get('/api/agendamentos/telefone/:telefone', (req, res) => {
    const sql = `
        SELECT a.*, s.nome as servico_nome, s.preco, col.nome as colaborador_nome
        FROM agendamentos a
        LEFT JOIN servicos s ON a.servico_id = s.id
        LEFT JOIN colaboradores col ON a.colaborador_id = col.id
        WHERE a.cliente_id IN (SELECT id FROM clientes WHERE telefone = ?)
        ORDER BY a.data_agendamento DESC
    `;
    db.all(sql, [req.params.telefone], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// ==================== DASHBOARD ====================
app.get('/api/dashboard', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];
    db.get(`
        SELECT
            (SELECT COUNT(*) FROM clientes) as total_clientes,
            (SELECT COUNT(*) FROM servicos WHERE ativo = 1) as total_servicos,
            (SELECT COUNT(*) FROM colaboradores WHERE ativo = 1) as total_colaboradores,
            (SELECT COUNT(*) FROM agendamentos WHERE data_agendamento = ?) as agendamentos_hoje,
            (SELECT COUNT(*) FROM agendamentos WHERE status = 'pendente') as agendamentos_pendentes
    `, [hoje], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(row);
    });
});

// ==================== PÁGINAS ====================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/clientes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'clientes.html')));
app.get('/agendamentos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'agendamentos.html')));
app.get('/servicos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'servicos.html')));
app.get('/colaboradores', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'colaboradores.html')));
app.get('/configuracoes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'configuracoes.html')));
app.get('/configuracoes-avancadas', (req, res) => res.sendFile(path.join(__dirname, 'public', 'configuracoes_avancadas.html')));

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   🏛️  SISTEMA DE AGENDAMENTO v3.0        ║
    ║                                          ║
    ║  🚀 Servidor: http://localhost:${PORT}     ║
    ║  👥 Clientes: http://localhost:${PORT}/clientes ║
    ║  📅 Agendamentos: http://localhost:${PORT}/agendamentos ║
    ║  💼 Serviços: http://localhost:${PORT}/servicos ║
    ║  🧑‍🤝‍🧑 Colaboradores: http://localhost:${PORT}/colaboradores ║
    ║  ⚙️ Config: http://localhost:${PORT}/configuracoes ║
    ║  🔧 Avançado: http://localhost:${PORT}/configuracoes-avancadas ║
    ║                                          ║
    ║  ✅ Sistema completo pronto!             ║
    ╚══════════════════════════════════════════╝
    `);
});