'use strict';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const sqlite3    = require('sqlite3').verbose();
const session    = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const fs         = require('fs');
const rateLimit  = require('express-rate-limit');
const helmet     = require('helmet');
const passport   = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const PORT               = process.env.PORT || 3000;
const NODE_ENV           = process.env.NODE_ENV || 'production';
const SESSION_SECRET     = process.env.SESSION_SECRET;
const GOOGLE_CLIENT_ID   = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL           = (process.env.BASE_URL || 'https://sistema-agendamento-0vzz.onrender.com').replace(/\/$/, '');

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    console.error('FATAL: SESSION_SECRET ausente ou fraco');
    process.exit(1);
}
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('FATAL: credenciais Google ausentes');
    process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

// HELMET
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            styleSrc:   ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            fontSrc:    ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            imgSrc:     ["'self'", "data:", "lh3.googleusercontent.com"],
            connectSrc: ["'self'"],
            frameSrc:   ["'none'"],
            objectSrc:  ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true },
    frameguard: { action: 'deny' },
}));

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : (NODE_ENV === 'production' ? [BASE_URL] : ['http://localhost:3000']);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin) || NODE_ENV !== 'production') return cb(null, true);
        cb(new Error('CORS bloqueado'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// RATE LIMITING
app.use(rateLimit({ windowMs: 15*60*1000, max: 150, standardHeaders: true, legacyHeaders: false }));
app.use('/auth/', rateLimit({ windowMs: 15*60*1000, max: 20, standardHeaders: true, legacyHeaders: false }));
app.use('/api/',  rateLimit({ windowMs: 60*1000,    max: 60,  standardHeaders: true, legacyHeaders: false }));

// BODY
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// SESSAO
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: './data' }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    rolling: true,
    cookie: { maxAge: 8*60*60*1000, httpOnly: true, secure: NODE_ENV==='production', sameSite: 'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

// BANCO
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (process.env.RESET_DB === 'true') {
    const f = path.join(dataDir, 'agendamento.db');
    if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('Banco resetado'); }
}

const dbPath = path.join(dataDir, 'agendamento.db');
const db = new sqlite3.Database(dbPath, err => {
    if (err) { console.error('Erro BD:', err.message); process.exit(1); }
    console.log('Banco conectado:', dbPath);
});
db.run('PRAGMA foreign_keys = OFF');
db.run('PRAGMA journal_mode = WAL');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
        google_id TEXT UNIQUE, foto TEXT, ativo INTEGER DEFAULT 1,
        tipo TEXT DEFAULT 'gestor', data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER UNIQUE,
        nome_empresa TEXT NOT NULL, cnpj TEXT, inscricao_estadual TEXT, atividade TEXT,
        endereco TEXT, cidade TEXT, estado TEXT, cep TEXT, telefone TEXT, email TEXT,
        site TEXT, cor_primaria TEXT DEFAULT '#667eea', cor_secundaria TEXT DEFAULT '#764ba2',
        descricao TEXT, data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL,
        nome TEXT NOT NULL, email TEXT, telefone TEXT, data_nascimento DATE,
        endereco TEXT, data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL,
        nome TEXT NOT NULL, descricao TEXT, preco REAL DEFAULT 0, duracao INTEGER DEFAULT 0, ativo INTEGER DEFAULT 1
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS colaboradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL,
        nome TEXT NOT NULL, especialidade TEXT, telefone TEXT, email TEXT,
        ativo INTEGER DEFAULT 1, descricao TEXT, data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL,
        cliente_id INTEGER, servico_id INTEGER, colaborador_id INTEGER,
        data_agendamento DATE NOT NULL, hora_agendamento TIME NOT NULL,
        status TEXT DEFAULT 'pendente', observacoes TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL,
        chave TEXT NOT NULL, valor TEXT NOT NULL, UNIQUE(usuario_id, chave)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER,
        acao TEXT NOT NULL, ip TEXT, criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Migracao segura
    ['ALTER TABLE usuarios ADD COLUMN google_id TEXT',
     'ALTER TABLE usuarios ADD COLUMN foto TEXT',
     'ALTER TABLE clientes ADD COLUMN usuario_id INTEGER',
     'ALTER TABLE clientes ADD COLUMN data_nascimento DATE',
     'ALTER TABLE servicos ADD COLUMN usuario_id INTEGER',
     'ALTER TABLE colaboradores ADD COLUMN usuario_id INTEGER',
     'ALTER TABLE agendamentos ADD COLUMN usuario_id INTEGER',
    ].forEach(sql => db.run(sql, [], err => {
        if (err && !err.message.includes('duplicate column') && !err.message.includes('no such table'))
            console.log('Migracao:', err.message);
    }));

    db.run('CREATE INDEX IF NOT EXISTS idx_cli_usr  ON clientes(usuario_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_svc_usr  ON servicos(usuario_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_col_usr  ON colaboradores(usuario_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_age_usr  ON agendamentos(usuario_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_age_data ON agendamentos(data_agendamento)');
    db.run('CREATE INDEX IF NOT EXISTS idx_usr_gid  ON usuarios(google_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_usr_email ON usuarios(email)');
});

// PASSPORT
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    db.get('SELECT id,nome,email,foto,tipo,ativo FROM usuarios WHERE id=? AND ativo=1', [id], (err, u) => done(err, u||null));
});
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: BASE_URL + '/auth/google/callback',
}, (at, rt, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const nome  = profile.displayName || 'Usuario';
    const gid   = profile.id;
    const foto  = profile.photos?.[0]?.value || null;
    if (!email) return done(new Error('Email indisponivel'));

    db.get('SELECT * FROM usuarios WHERE google_id=? OR email=?', [gid, email], (err, u) => {
        if (err) return done(err);
        if (u) { db.run('UPDATE usuarios SET google_id=?,foto=? WHERE id=?',[gid,foto,u.id]); return done(null,u); }
        db.run('INSERT INTO usuarios (nome,email,google_id,foto,tipo) VALUES (?,?,?,?,?)',
            [nome,email,gid,foto,'gestor'], function(err) {
            if (err) return done(err);
            const uid = this.lastID;
            db.run('INSERT INTO empresas (usuario_id,nome_empresa) VALUES (?,?)',[uid,'Minha Empresa']);
            [['lembrete_horas','24'],['cancelamento_horas','2'],['notif_cliente','sim'],
             ['notif_empresa','sim'],['permitir_recorrente','sim'],['whatsapp','']
            ].forEach(([c,v]) => db.run('INSERT OR IGNORE INTO configuracoes (usuario_id,chave,valor) VALUES (?,?,?)',[uid,c,v]));
            db.get('SELECT * FROM usuarios WHERE id=?',[uid],(err,u)=>done(err,u));
        });
    });
}));

app.use(express.static(path.join(__dirname, 'public'), { etag: true }));

// HELPERS
const sanitize = (s, n=500) => s==null ? null : String(s).trim().slice(0,n).replace(/[<>]/g,'');
const isEmail  = e => /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(String(e).toLowerCase());
const isDate   = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
const isHora   = h => /^\d{2}:\d{2}$/.test(h);
const audit    = (uid, acao, req) => db.run('INSERT INTO audit_log (usuario_id,acao,ip) VALUES (?,?,?)',
    [uid, acao, req.ip||'?']);

// AUTH MIDDLEWARE
const auth      = (req,res,next) => req.isAuthenticated() ? next() : (req.path.startsWith('/api/') ? res.status(401).json({erro:'Nao autenticado'}) : res.redirect('/login.html'));
const authAdmin = (req,res,next) => req.isAuthenticated() && req.user.tipo==='admin' ? next() : res.status(403).json({erro:'Acesso negado'});

// HEALTH
app.get('/health', (_,res) => res.json({status:'ok'}));

// GOOGLE OAUTH
app.get('/auth/google', passport.authenticate('google',{scope:['profile','email'],prompt:'select_account'}));
app.get('/auth/google/callback',
    passport.authenticate('google',{failureRedirect:'/login.html?erro=auth'}),
    (req,res) => { audit(req.user.id,'LOGIN',req); res.redirect('/'); }
);
app.post('/auth/logout', auth, (req,res) => {
    const uid = req.user?.id;
    req.logout(err => {
        req.session.destroy(()=>{ res.clearCookie('sid'); if(uid) audit(uid,'LOGOUT',req); res.json({mensagem:'Logout realizado'}); });
    });
});

app.get('/login.html',(_,res,next)=>{ if(_.isAuthenticated()) return res.redirect('/'); next(); },
    (req,res)=>res.sendFile(path.join(__dirname,'public','login.html')));
app.get('/cliente',(_,res)=>res.sendFile(path.join(__dirname,'public','cliente','index.html')));
app.get('/api/auth/me', auth, (req,res) => res.json({id:req.user.id,nome:req.user.nome,email:req.user.email,foto:req.user.foto,tipo:req.user.tipo}));

// DIAGNOSTICO ADMIN
app.get('/api/diagnostico', authAdmin, (req,res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",[],(_,tables)=>{
        Promise.all((tables||[]).map(t=>new Promise(r=>db.get(`SELECT COUNT(*) n FROM "${t.name}"`,[],(_,row)=>r({t:t.name,n:row?.n||0}))))).then(d=>res.json({ok:true,tabelas:d}));
    });
});

// PROTEGER APIs
['clientes','servicos','colaboradores','agendamentos','configuracoes','dashboard','aniversariantes','empresa']
    .forEach(r => app.use('/api/'+r, auth));

// CLIENTES
app.get('/api/clientes',(req,res)=>{
    db.all('SELECT * FROM clientes WHERE usuario_id=? ORDER BY nome COLLATE NOCASE',[req.user.id],(err,rows)=>{
        if(err) return res.status(500).json({erro:'Erro interno'}); res.json(rows||[]);
    });
});
app.post('/api/clientes',(req,res)=>{
    const nome=sanitize(req.body.nome), email=sanitize(req.body.email),
          tel=sanitize(req.body.telefone,20), dn=sanitize(req.body.data_nascimento,10), end=sanitize(req.body.endereco);
    if(!nome) return res.status(400).json({erro:'Nome obrigatorio'});
    if(email&&!isEmail(email)) return res.status(400).json({erro:'Email invalido'});
    if(dn&&!isDate(dn)) return res.status(400).json({erro:'Data invalida'});
    db.run('INSERT INTO clientes (usuario_id,nome,email,telefone,data_nascimento,endereco) VALUES (?,?,?,?,?,?)',
        [req.user.id,nome,email||null,tel||null,dn||null,end||null], function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        audit(req.user.id,'CLIENTE_CRIADO:'+this.lastID,req);
        res.status(201).json({mensagem:'Cliente cadastrado',id:this.lastID});
    });
});
app.put('/api/clientes/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    const nome=sanitize(req.body.nome), email=sanitize(req.body.email),
          tel=sanitize(req.body.telefone,20), dn=sanitize(req.body.data_nascimento,10), end=sanitize(req.body.endereco);
    if(!nome) return res.status(400).json({erro:'Nome obrigatorio'});
    if(email&&!isEmail(email)) return res.status(400).json({erro:'Email invalido'});
    db.run('UPDATE clientes SET nome=?,email=?,telefone=?,data_nascimento=?,endereco=? WHERE id=? AND usuario_id=?',
        [nome,email||null,tel||null,dn||null,end||null,id,req.user.id], function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Cliente atualizado'});
    });
});
app.delete('/api/clientes/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    db.run('DELETE FROM clientes WHERE id=? AND usuario_id=?',[id,req.user.id],function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        audit(req.user.id,'CLIENTE_REMOVIDO:'+id,req); res.json({mensagem:'Removido'});
    });
});

// SERVICOS
app.get('/api/servicos',(req,res)=>{
    db.all('SELECT * FROM servicos WHERE usuario_id=? AND ativo=1 ORDER BY nome COLLATE NOCASE',[req.user.id],(err,rows)=>{
        if(err) return res.status(500).json({erro:'Erro interno'}); res.json(rows||[]);
    });
});
app.post('/api/servicos',(req,res)=>{
    const nome=sanitize(req.body.nome), desc=sanitize(req.body.descricao),
          preco=Math.max(0,parseFloat(req.body.preco)||0), dur=Math.max(0,parseInt(req.body.duracao)||0);
    if(!nome) return res.status(400).json({erro:'Nome obrigatorio'});
    db.run('INSERT INTO servicos (usuario_id,nome,descricao,preco,duracao) VALUES (?,?,?,?,?)',
        [req.user.id,nome,desc||null,preco,dur], function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        res.status(201).json({mensagem:'Servico cadastrado',id:this.lastID});
    });
});
app.put('/api/servicos/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    const nome=sanitize(req.body.nome), desc=sanitize(req.body.descricao),
          preco=Math.max(0,parseFloat(req.body.preco)||0), dur=Math.max(0,parseInt(req.body.duracao)||0),
          ativo=(req.body.ativo===false||req.body.ativo===0)?0:1;
    if(!nome) return res.status(400).json({erro:'Nome obrigatorio'});
    db.run('UPDATE servicos SET nome=?,descricao=?,preco=?,duracao=?,ativo=? WHERE id=? AND usuario_id=?',
        [nome,desc||null,preco,dur,ativo,id,req.user.id], function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Servico atualizado'});
    });
});
app.delete('/api/servicos/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    db.run('UPDATE servicos SET ativo=0 WHERE id=? AND usuario_id=?',[id,req.user.id],function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Desativado'});
    });
});

// COLABORADORES
app.get('/api/colaboradores',(req,res)=>{
    db.all('SELECT * FROM colaboradores WHERE usuario_id=? AND ativo=1 ORDER BY nome COLLATE NOCASE',[req.user.id],(err,rows)=>{
        if(err) return res.status(500).json({erro:'Erro interno'}); res.json(rows||[]);
    });
});
app.post('/api/colaboradores',(req,res)=>{
    const nome=sanitize(req.body.nome), esp=sanitize(req.body.especialidade),
          tel=sanitize(req.body.telefone,20), email=sanitize(req.body.email), desc=sanitize(req.body.descricao);
    if(!nome) return res.status(400).json({erro:'Nome obrigatorio'});
    if(email&&!isEmail(email)) return res.status(400).json({erro:'Email invalido'});
    db.run('INSERT INTO colaboradores (usuario_id,nome,especialidade,telefone,email,descricao) VALUES (?,?,?,?,?,?)',
        [req.user.id,nome,esp||null,tel||null,email||null,desc||null], function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        res.status(201).json({mensagem:'Colaborador cadastrado',id:this.lastID});
    });
});
app.put('/api/colaboradores/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    const nome=sanitize(req.body.nome), esp=sanitize(req.body.especialidade),
          tel=sanitize(req.body.telefone,20), email=sanitize(req.body.email), desc=sanitize(req.body.descricao);
    if(!nome) return res.status(400).json({erro:'Nome obrigatorio'});
    if(email&&!isEmail(email)) return res.status(400).json({erro:'Email invalido'});
    db.run('UPDATE colaboradores SET nome=?,especialidade=?,telefone=?,email=?,descricao=? WHERE id=? AND usuario_id=?',
        [nome,esp||null,tel||null,email||null,desc||null,id,req.user.id], function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Colaborador atualizado'});
    });
});
app.delete('/api/colaboradores/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    db.run('UPDATE colaboradores SET ativo=0 WHERE id=? AND usuario_id=?',[id,req.user.id],function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Desativado'});
    });
});

// AGENDAMENTOS
app.get('/api/agendamentos',(req,res)=>{
    const {data_inicio,data_fim}=req.query;
    let sql=`SELECT a.id,a.data_agendamento,a.hora_agendamento,a.status,a.observacoes,
        c.nome AS cliente_nome,c.telefone AS cliente_telefone,
        s.nome AS servico_nome,s.preco,col.nome AS colaborador_nome
        FROM agendamentos a
        LEFT JOIN clientes c ON a.cliente_id=c.id
        LEFT JOIN servicos s ON a.servico_id=s.id
        LEFT JOIN colaboradores col ON a.colaborador_id=col.id
        WHERE a.usuario_id=?`;
    const p=[req.user.id];
    if(data_inicio&&isDate(data_inicio)){sql+=' AND a.data_agendamento>=?';p.push(data_inicio);}
    if(data_fim&&isDate(data_fim)){sql+=' AND a.data_agendamento<=?';p.push(data_fim);}
    sql+=' ORDER BY a.data_agendamento DESC,a.hora_agendamento DESC LIMIT 500';
    db.all(sql,p,(err,rows)=>{if(err) return res.status(500).json({erro:'Erro interno'}); res.json(rows||[]);});
});
app.post('/api/agendamentos',(req,res)=>{
    const cid=parseInt(req.body.cliente_id), sid=parseInt(req.body.servico_id),
          colid=req.body.colaborador_id?parseInt(req.body.colaborador_id):null,
          data=sanitize(req.body.data_agendamento,10), hora=sanitize(req.body.hora_agendamento,5),
          obs=sanitize(req.body.observacoes,1000);
    if(!cid||cid<=0) return res.status(400).json({erro:'Cliente invalido'});
    if(!sid||sid<=0) return res.status(400).json({erro:'Servico invalido'});
    if(!data||!isDate(data)) return res.status(400).json({erro:'Data invalida'});
    if(!hora||!isHora(hora)) return res.status(400).json({erro:'Hora invalida'});
    db.get('SELECT id FROM clientes WHERE id=? AND usuario_id=?',[cid,req.user.id],(err,c)=>{
        if(err||!c) return res.status(403).json({erro:'Cliente nao autorizado'});
        db.get('SELECT id FROM servicos WHERE id=? AND usuario_id=? AND ativo=1',[sid,req.user.id],(err,s)=>{
            if(err||!s) return res.status(403).json({erro:'Servico nao autorizado'});
            db.run('INSERT INTO agendamentos (usuario_id,cliente_id,servico_id,colaborador_id,data_agendamento,hora_agendamento,observacoes) VALUES (?,?,?,?,?,?,?)',
                [req.user.id,cid,sid,colid,data,hora,obs||null], function(err){
                if(err) return res.status(500).json({erro:'Erro interno'});
                audit(req.user.id,'AGEND_CRIADO:'+this.lastID,req);
                res.status(201).json({mensagem:'Agendamento criado',id:this.lastID});
            });
        });
    });
});
app.put('/api/agendamentos/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    const STATUS=['pendente','confirmado','cancelado','concluido'];
    const status=sanitize(req.body.status,20);
    if(!STATUS.includes(status)) return res.status(400).json({erro:'Status invalido'});
    db.run('UPDATE agendamentos SET status=? WHERE id=? AND usuario_id=?',[status,id,req.user.id],function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Atualizado'});
    });
});
app.delete('/api/agendamentos/:id',(req,res)=>{
    const id=parseInt(req.params.id); if(!id||id<=0) return res.status(400).json({erro:'ID invalido'});
    db.run('DELETE FROM agendamentos WHERE id=? AND usuario_id=?',[id,req.user.id],function(err){
        if(err) return res.status(500).json({erro:'Erro interno'});
        if(!this.changes) return res.status(404).json({erro:'Nao encontrado'});
        res.json({mensagem:'Removido'});
    });
});

// DASHBOARD
app.get('/api/dashboard',(req,res)=>{
    const hoje=new Date().toISOString().split('T')[0];
    const mes=(new Date().getMonth()+1).toString().padStart(2,'0');
    const dia=new Date().getDate().toString().padStart(2,'0');
    db.get(`SELECT
        (SELECT COUNT(*) FROM clientes WHERE usuario_id=?) total_clientes,
        (SELECT COUNT(*) FROM servicos WHERE usuario_id=? AND ativo=1) total_servicos,
        (SELECT COUNT(*) FROM colaboradores WHERE usuario_id=? AND ativo=1) total_colaboradores,
        (SELECT COUNT(*) FROM agendamentos WHERE usuario_id=? AND data_agendamento=?) agendamentos_hoje,
        (SELECT COUNT(*) FROM agendamentos WHERE usuario_id=? AND status='pendente') agendamentos_pendentes,
        (SELECT COUNT(*) FROM clientes WHERE usuario_id=? AND data_nascimento IS NOT NULL AND strftime('%m-%d',data_nascimento)=?) aniversariantes_hoje`,
        [req.user.id,req.user.id,req.user.id,req.user.id,hoje,req.user.id,req.user.id,mes+'-'+dia],
        (err,row)=>{if(err) return res.status(500).json({erro:'Erro interno'}); res.json(row||{});});
});

// ANIVERSARIANTES
app.get('/api/aniversariantes',(req,res)=>{
    const mes=Math.min(12,Math.max(1,parseInt(req.query.mes)||new Date().getMonth()+1));
    const m=mes.toString().padStart(2,'0');
    db.all(`SELECT id,nome,email,telefone,data_nascimento FROM clientes
        WHERE usuario_id=? AND data_nascimento IS NOT NULL AND strftime('%m',data_nascimento)=?
        ORDER BY strftime('%d',data_nascimento)`,
        [req.user.id,m],(err,rows)=>{if(err) return res.status(500).json({erro:'Erro interno'}); res.json(rows||[]);});
});

// EMPRESA
app.get('/api/empresa',(req,res)=>{
    db.get('SELECT * FROM empresas WHERE usuario_id=?',[req.user.id],(err,row)=>{
        if(err) return res.status(500).json({erro:'Erro interno'}); res.json(row||{});
    });
});
app.put('/api/empresa',(req,res)=>{
    const C=['nome_empresa','cnpj','inscricao_estadual','atividade','endereco','cidade','estado','cep','telefone','email','site','descricao','cor_primaria','cor_secundaria'];
    const v=C.map(c=>sanitize(req.body[c]));
    db.get('SELECT id FROM empresas WHERE usuario_id=?',[req.user.id],(err,row)=>{
        if(err) return res.status(500).json({erro:'Erro interno'});
        const ok=e=>e?res.status(500).json({erro:'Erro interno'}):res.json({mensagem:'Empresa salva'});
        if(row) db.run('UPDATE empresas SET '+C.map(c=>c+'=?').join(',')+'WHERE usuario_id=?',[...v,req.user.id],function(e){ok(e);});
        else db.run('INSERT INTO empresas (usuario_id,'+C.join(',')+'VALUES (?,'+C.map(()=>'?').join(',')+')',[req.user.id,...v],function(e){ok(e);});
    });
});

// CONFIGURACOES
const CHAVES=['lembrete_horas','cancelamento_horas','notif_cliente','notif_empresa','permitir_recorrente','whatsapp'];
app.get('/api/configuracoes',(req,res)=>{
    db.all('SELECT chave,valor FROM configuracoes WHERE usuario_id=?',[req.user.id],(err,rows)=>{
        if(err) return res.status(500).json({erro:'Erro interno'});
        const cfg={}; (rows||[]).forEach(r=>{cfg[r.chave]=r.valor;}); res.json(cfg);
    });
});
app.put('/api/configuracoes',(req,res)=>{
    const ups=CHAVES.filter(c=>req.body[c]!==undefined).map(c=>[sanitize(String(req.body[c]),200),req.user.id,c]);
    if(!ups.length) return res.status(400).json({erro:'Nenhuma configuracao valida'});
    let p=ups.length, err=false;
    ups.forEach(([v,uid,c])=>db.run('INSERT INTO configuracoes (usuario_id,chave,valor) VALUES (?,?,?) ON CONFLICT(usuario_id,chave) DO UPDATE SET valor=excluded.valor',
        [uid,c,v],e=>{if(e&&!err){err=true;return res.status(500).json({erro:'Erro interno'});}if(!--p&&!err)res.json({mensagem:'Salvo'});}));
});

// PAGINAS PROTEGIDAS
app.get('/', auth, (req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
const PAGS={'/clientes':'pages/clientes.html','/agendamentos':'pages/agendamentos.html','/servicos':'pages/servicos.html',
    '/colaboradores':'pages/colaboradores.html','/configuracoes':'configuracoes.html',
    '/configuracoes-avancadas':'configuracoes_avancadas.html','/empresa':'empresa.html','/aniversariantes':'aniversariantes.html'};
Object.entries(PAGS).forEach(([r,f])=>app.get(r,auth,(req,res)=>{
    const fp=path.join(__dirname,'public',f);
    if(!fs.existsSync(fp)) return res.status(404).send('Pagina nao encontrada');
    res.sendFile(fp);
}));

// 404 API
app.use('/api/',(req,res)=>res.status(404).json({erro:'Endpoint nao encontrado'}));

// ERRO GLOBAL
app.use((err,req,res,next)=>{
    console.error('Erro:',err.message);
    if(req.path.startsWith('/api/')) return res.status(500).json({erro:'Erro interno do servidor'});
    res.status(500).send('Erro interno');
});

// SHUTDOWN
const shutdown=()=>{db.close(()=>process.exit(0));setTimeout(()=>process.exit(1),5000);};
process.on('SIGTERM',shutdown);
process.on('SIGINT',shutdown);

app.listen(PORT,()=>{
    console.log('AgendaPro porta '+PORT+' ['+NODE_ENV+']');
    console.log('OAuth: '+BASE_URL+'/auth/google');
});
