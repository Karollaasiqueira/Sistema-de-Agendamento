const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Banco de Dados
const db = new sqlite3.Database(path.join(__dirname, 'data', 'agendamento.db'));

// Criar tabelas
db.serialize(() => {
    // Tabela de clientes
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefone TEXT,
            endereco TEXT,
            data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de serviços
    db.run(`
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco DECIMAL(10,2),
            duracao INTEGER,
            ativo BOOLEAN DEFAULT 1
        )
    `);

    // Tabela de agendamentos
    db.run(`
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            servico_id INTEGER,
            data_agendamento DATE,
            hora_agendamento TIME,
            status TEXT DEFAULT 'pendente',
            observacoes TEXT,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id),
            FOREIGN KEY (servico_id) REFERENCES servicos(id)
        )
    `);

    // Inserir serviços padrão se não existirem
    db.get("SELECT COUNT(*) as count FROM servicos", (err, row) => {
        if (row.count === 0) {
            const servicos = [
                ['Consulta Simples', 'Consulta básica', 100.00, 30],
                ['Consulta Completa', 'Consulta com exames', 200.00, 60],
                ['Retorno', 'Consulta de retorno', 80.00, 20],
                ['Procedimento', 'Procedimento simples', 300.00, 90]
            ];
            
            servicos.forEach(s => {
                db.run(
                    'INSERT INTO servicos (nome, descricao, preco, duracao) VALUES (?, ?, ?, ?)',
                    s
                );
            });
            console.log('✅ Serviços padrão criados');
        }
    });
});

console.log('✅ Banco de dados conectado');

// Rotas da API
// Clientes
app.get('/api/clientes', (req, res) => {
    db.all('SELECT * FROM clientes ORDER BY nome', [], (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/clientes', (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    
    if (!nome || !email) {
        res.status(400).json({ erro: 'Nome e email são obrigatórios' });
        return;
    }
    
    db.run(
        'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
        [nome, email, telefone, endereco],
        function(err) {
            if (err) {
                res.status(400).json({ erro: err.message });
                return;
            }
            res.json({ 
                mensagem: '✅ Cliente cadastrado!',
                id: this.lastID 
            });
        }
    );
});

app.put('/api/clientes/:id', (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    db.run(
        'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
        [nome, email, telefone, endereco, req.params.id],
        function(err) {
            if (err) {
                res.status(400).json({ erro: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ erro: 'Cliente não encontrado' });
                return;
            }
            res.json({ mensagem: '✅ Cliente atualizado!' });
        }
    );
});

app.delete('/api/clientes/:id', (req, res) => {
    db.run('DELETE FROM clientes WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ erro: 'Cliente não encontrado' });
            return;
        }
        res.json({ mensagem: '✅ Cliente deletado!' });
    });
});

// Serviços
app.get('/api/servicos', (req, res) => {
    db.all('SELECT * FROM servicos WHERE ativo = 1 ORDER BY nome', [], (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/servicos', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    
    if (!nome) {
        res.status(400).json({ erro: 'Nome do serviço é obrigatório' });
        return;
    }
    
    db.run(
        'INSERT INTO servicos (nome, descricao, preco, duracao) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, duracao],
        function(err) {
            if (err) {
                res.status(400).json({ erro: err.message });
                return;
            }
            res.json({ 
                mensagem: '✅ Serviço cadastrado!',
                id: this.lastID 
            });
        }
    );
});

app.put('/api/servicos/:id', (req, res) => {
    const { nome, descricao, preco, duracao } = req.body;
    db.run(
        'UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao = ? WHERE id = ?',
        [nome, descricao, preco, duracao, req.params.id],
        function(err) {
            if (err) {
                res.status(400).json({ erro: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ erro: 'Serviço não encontrado' });
                return;
            }
            res.json({ mensagem: '✅ Serviço atualizado!' });
        }
    );
});

app.put('/api/servicos/:id/toggle', (req, res) => {
    db.run(
        'UPDATE servicos SET ativo = NOT ativo WHERE id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ erro: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ erro: 'Serviço não encontrado' });
                return;
            }
            res.json({ mensagem: '✅ Status do serviço alterado!' });
        }
    );
});

// Agendamentos
app.get('/api/agendamentos', (req, res) => {
    const sql = `
        SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome, s.preco 
        FROM agendamentos a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN servicos s ON a.servico_id = s.id
        ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/agendamentos', (req, res) => {
    const { cliente_id, servico_id, data_agendamento, hora_agendamento, observacoes } = req.body;
    
    if (!cliente_id || !servico_id || !data_agendamento || !hora_agendamento) {
        res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        return;
    }
    
    db.run(
        `INSERT INTO agendamentos (cliente_id, servico_id, data_agendamento, hora_agendamento, observacoes) 
         VALUES (?, ?, ?, ?, ?)`,
        [cliente_id, servico_id, data_agendamento, hora_agendamento, observacoes],
        function(err) {
            if (err) {
                res.status(400).json({ erro: err.message });
                return;
            }
            res.json({ 
                mensagem: '✅ Agendamento realizado!',
                id: this.lastID 
            });
        }
    );
});

app.put('/api/agendamentos/:id', (req, res) => {
    const { cliente_id, servico_id, data_agendamento, hora_agendamento, observacoes } = req.body;
    db.run(
        `UPDATE agendamentos SET cliente_id = ?, servico_id = ?, data_agendamento = ?, hora_agendamento = ?, observacoes = ? 
         WHERE id = ?`,
        [cliente_id, servico_id, data_agendamento, hora_agendamento, observacoes, req.params.id],
        function(err) {
            if (err) {
                res.status(400).json({ erro: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ erro: 'Agendamento não encontrado' });
                return;
            }
            res.json({ mensagem: '✅ Agendamento atualizado!' });
        }
    );
});

app.put('/api/agendamentos/:id/status', (req, res) => {
    const { status } = req.body;
    const statusValidos = ['pendente', 'confirmado', 'cancelado', 'concluido'];
    
    if (!statusValidos.includes(status)) {
        res.status(400).json({ erro: 'Status inválido' });
        return;
    }
    
    db.run(
        'UPDATE agendamentos SET status = ? WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ erro: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ erro: 'Agendamento não encontrado' });
                return;
            }
            res.json({ mensagem: `✅ Status atualizado para ${status}` });
        }
    );
});

// Dashboard
app.get('/api/dashboard', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];
    
    db.get(`
        SELECT 
            (SELECT COUNT(*) FROM clientes) as total_clientes,
            (SELECT COUNT(*) FROM servicos) as total_servicos,
            (SELECT COUNT(*) FROM agendamentos WHERE data_agendamento = ?) as agendamentos_hoje,
            (SELECT COUNT(*) FROM agendamentos WHERE status = 'pendente') as agendamentos_pendentes
    `, [hoje], (err, row) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json(row);
    });
});

// Páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'clientes.html'));
});

app.get('/agendamentos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'agendamentos.html'));
});

app.get('/servicos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'servicos.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║     🏛️  SISTEMA DE AGENDAMENTO v2.1      ║
    ║                                          ║
    ║  🚀 Servidor: http://localhost:${PORT}     ║
    ║  📊 Dashboard: http://localhost:${PORT}    ║
    ║  👥 Clientes: http://localhost:${PORT}/clientes ║
    ║  📅 Agendamentos: http://localhost:${PORT}/agendamentos ║
    ║  💼 Serviços: http://localhost:${PORT}/servicos ║
    ║                                          ║
    ║  ✅ Sistema pronto para o cliente!       ║
    ╚══════════════════════════════════════════╝
    `);
});