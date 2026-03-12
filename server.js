'use strict';
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const session    = require('express-session');
const pgSession  = require('connect-pg-simple')(session);
const fs         = require('fs');
const rateLimit  = require('express-rate-limit');
const helmet     = require('helmet');
const passport   = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Pool }   = require('pg');

const PORT             = process.env.PORT || 3000;
const NODE_ENV         = process.env.NODE_ENV || 'production';
const SESSION_SECRET   = process.env.SESSION_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL         = (process.env.BASE_URL || 'https://sistema-agendamento-0vzz.onrender.com').replace(/\/$/, '');
const DATABASE_URL     = process.env.DATABASE_URL;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'karollaasiqueira@gmail.com';

if (!SESSION_SECRET || SESSION_SECRET.length < 32) { console.error('FATAL: SESSION_SECRET ausente ou fraco'); process.exit(1); }
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET)    { console.error('FATAL: credenciais Google ausentes'); process.exit(1); }
if (!DATABASE_URL)                                  { console.error('FATAL: DATABASE_URL ausente'); process.exit(1); }

// ========== POSTGRESQL ==========
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
const q = (text, params) => pool.query(text, params);

// ========== APP ==========
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

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

app.use(rateLimit({ windowMs:15*60*1000, max:200, standardHeaders:true, legacyHeaders:false, skip:r=>r.path==='/health' }));
app.use('/auth/', rateLimit({ windowMs:15*60*1000, max:20, standardHeaders:true, legacyHeaders:false }));
app.use('/api/',  rateLimit({ windowMs:60*1000,    max:100, standardHeaders:true, legacyHeaders:false }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use(session({
    store: new pgSession({ pool, tableName: 'sessions', createTableIfMissing: true }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    rolling: true,
    cookie: { maxAge:8*60*60*1000, httpOnly:true, secure:NODE_ENV==='production', sameSite:'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

// ========== INIT DB ==========
async function initDB() {
    console.log('Inicializando banco PostgreSQL...');

    await q(`CREATE TABLE IF NOT EXISTS usuarios (
        id            SERIAL PRIMARY KEY,
        nome          TEXT NOT NULL,
        email         TEXT UNIQUE NOT NULL,
        google_id     TEXT UNIQUE,
        foto          TEXT,
        ativo         BOOLEAN DEFAULT TRUE,
        tipo          TEXT DEFAULT 'gestor' CHECK(tipo IN ('gestor','admin','superadmin')),
        data_cadastro TIMESTAMPTZ DEFAULT NOW()
    )`);

    await q(`CREATE TABLE IF NOT EXISTS empresas (
        id               SERIAL PRIMARY KEY,
        usuario_id       INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
        nome_empresa     TEXT NOT NULL DEFAULT 'Minha Empresa',
        cnpj             TEXT, inscricao_estadual TEXT, atividade TEXT,
        endereco TEXT, cidade TEXT, estado TEXT, cep TEXT,
        telefone TEXT, email TEXT, site TEXT,
        cor_primaria TEXT DEFAULT '#667eea', cor_secundaria TEXT DEFAULT '#764ba2',
        descricao TEXT, data_cadastro TIMESTAMPTZ DEFAULT NOW()
    )`);

    await q(`CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        nome TEXT NOT NULL, email TEXT, telefone TEXT,
        data_nascimento DATE, endereco TEXT,
        data_cadastro TIMESTAMPTZ DEFAULT NOW()
    )`);

    await q(`CREATE TABLE IF NOT EXISTS servicos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        nome TEXT NOT NULL, descricao TEXT,
        preco NUMERIC(10,2) DEFAULT 0, duracao INTEGER DEFAULT 0, ativo BOOLEAN DEFAULT TRUE
    )`);

    await q(`CREATE TABLE IF NOT EXISTS colaboradores (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        nome TEXT NOT NULL, especialidade TEXT, telefone TEXT, email TEXT,
        ativo BOOLEAN DEFAULT TRUE, descricao TEXT, data_cadastro TIMESTAMPTZ DEFAULT NOW()
    )`);

    await q(`CREATE TABLE IF NOT EXISTS agendamentos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        cliente_id INTEGER REFERENCES clientes(id),
        servico_id INTEGER REFERENCES servicos(id),
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data_agendamento DATE NOT NULL, hora_agendamento TIME NOT NULL,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente','confirmado','cancelado','concluido')),
        observacoes TEXT, data_criacao TIMESTAMPTZ DEFAULT NOW()
    )`);

    await q(`CREATE TABLE IF NOT EXISTS configuracoes (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        chave TEXT NOT NULL, valor TEXT NOT NULL,
        UNIQUE(usuario_id, chave)
    )`);

    await q(`CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        acao TEXT NOT NULL, detalhes TEXT,
        ip TEXT, user_agent TEXT,
        criado_em TIMESTAMPTZ DEFAULT NOW()
    )`);

    await q(`CREATE INDEX IF NOT EXISTS idx_cli_usr   ON clientes(usuario_id)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_svc_usr   ON servicos(usuario_id)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_col_usr   ON colaboradores(usuario_id)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_age_usr   ON agendamentos(usuario_id)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_age_data  ON agendamentos(data_agendamento)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_audit_usr ON audit_log(usuario_id)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_audit_dt  ON audit_log(criado_em DESC)`);

    // Garantir superadmin
    await q(`UPDATE usuarios SET tipo='superadmin' WHERE email=$1 AND tipo!='superadmin'`, [SUPER_ADMIN_EMAIL]);

    console.log('Banco inicializado!');
}

// ========== PASSPORT ==========
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await q('SELECT id,nome,email,foto,tipo,ativo FROM usuarios WHERE id=$1 AND ativo=TRUE', [id]);
        done(null, rows[0] || null);
    } catch(e) { done(e, null); }
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: BASE_URL + '/auth/google/callback',
}, async (at, rt, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const nome  = profile.displayName || 'Usuário';
        const gid   = profile.id;
        const foto  = profile.photos?.[0]?.value || null;
        if (!email) return done(new Error('Email indisponível'));

        let { rows } = await q('SELECT * FROM usuarios WHERE google_id=$1 OR email=$2', [gid, email]);
        let usuario = rows[0];

        if (usuario) {
            const tipo = email === SUPER_ADMIN_EMAIL ? 'superadmin' : usuario.tipo;
            await q('UPDATE usuarios SET google_id=$1, foto=$2, tipo=$3 WHERE id=$4', [gid, foto, tipo, usuario.id]);
            usuario.tipo = tipo;
        } else {
            const tipo = email === SUPER_ADMIN_EMAIL ? 'superadmin' : 'gestor';
            const ins = await q(
                'INSERT INTO usuarios (nome,email,google_id,foto,tipo) VALUES ($1,$2,$3,$4,$5) RETURNING *',
                [nome, email, gid, foto, tipo]
            );
            usuario = ins.rows[0];
            await q('INSERT INTO empresas (usuario_id,nome_empresa) VALUES ($1,$2)', [usuario.id, 'Minha Empresa']);
            for (const [c,v] of [['lembrete_horas','24'],['cancelamento_horas','2'],['notif_cliente','sim'],['notif_empresa','sim'],['permitir_recorrente','sim'],['whatsapp','']]) {
                await q('INSERT INTO configuracoes (usuario_id,chave,valor) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING', [usuario.id,c,v]);
            }
        }
        const { rows: r2 } = await q('SELECT * FROM usuarios WHERE id=$1', [usuario.id]);
        done(null, r2[0]);
    } catch(e) { done(e); }
}));

// ========== STATIC ==========
app.use(express.static(path.join(__dirname, 'public'), { etag: true }));

// ========== HELPERS ==========
const sanitize = (s, n=500) => s==null ? null : String(s).trim().slice(0,n).replace(/[<>]/g,'');
const isEmail  = e => /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(String(e).toLowerCase());
const isDate   = d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
const isHora   = h => /^\d{2}:\d{2}$/.test(h);
const getIP    = req => req.ip || '?';

async function audit(usuarioId, acao, detalhes, req) {
    try {
        await q('INSERT INTO audit_log (usuario_id,acao,detalhes,ip,user_agent) VALUES ($1,$2,$3,$4,$5)',
            [usuarioId, acao, detalhes||null, getIP(req), req?.headers?.['user-agent']?.slice(0,200)||'']);
    } catch(e) { console.error('Audit error:', e.message); }
}

// ========== MIDDLEWARES AUTH ==========
const auth = (req,res,next) => req.isAuthenticated() ? next() :
    (req.path.startsWith('/api/') ? res.status(401).json({erro:'Não autenticado'}) : res.redirect('/login.html'));

const authSuper = (req,res,next) => {
    if (!req.isAuthenticated()) return res.status(401).json({erro:'Não autenticado'});
    if (req.user.tipo !== 'superadmin') return res.status(403).json({erro:'Acesso restrito ao Super Admin'});
    next();
};

// ========== HEALTH ==========
app.get('/health', (_,res) => res.json({status:'ok',ts:Date.now()}));

// ========== OAUTH ==========
app.get('/auth/google', passport.authenticate('google',{scope:['profile','email'],prompt:'select_account'}));
app.get('/auth/google/callback',
    passport.authenticate('google',{failureRedirect:'/login.html?erro=auth'}),
    async (req,res) => { await audit(req.user.id,'LOGIN',null,req); res.redirect('/'); }
);
app.post('/auth/logout', auth, async (req,res) => {
    const uid = req.user?.id;
    req.logout(err => {
        req.session.destroy(async () => {
            res.clearCookie('sid');
            if (uid) await audit(uid,'LOGOUT',null,req);
            res.json({mensagem:'Logout realizado'});
        });
    });
});

// ========== PÁGINAS PÚBLICAS ==========
app.get('/login.html', (req,res,next) => { if (req.isAuthenticated()) return res.redirect('/'); next(); },
    (_,res) => res.sendFile(path.join(__dirname,'public','login.html')));
app.get('/cliente', (_,res) => res.sendFile(path.join(__dirname,'public','cliente','index.html')));

// ========== API ME ==========
app.get('/api/auth/me', auth, (req,res) => res.json({
    id:req.user.id, nome:req.user.nome, email:req.user.email, foto:req.user.foto, tipo:req.user.tipo
}));

// ========== SUPER ADMIN — DASHBOARD ==========
app.get('/api/superadmin/dashboard', authSuper, async (req,res) => {
    try {
        const [tot_usr, tot_age, tot_cli, tot_audit, ativos, inativos, por_mes, agend_por_usr, ultimos_logins] = await Promise.all([
            q(`SELECT COUNT(*) n FROM usuarios WHERE tipo!='superadmin'`),
            q(`SELECT COUNT(*) n FROM agendamentos`),
            q(`SELECT COUNT(*) n FROM clientes`),
            q(`SELECT COUNT(*) n FROM audit_log`),
            q(`SELECT COUNT(*) n FROM usuarios WHERE ativo=TRUE AND tipo!='superadmin'`),
            q(`SELECT COUNT(*) n FROM usuarios WHERE ativo=FALSE`),
            q(`SELECT TO_CHAR(data_cadastro,'YYYY-MM') mes, COUNT(*) total FROM usuarios WHERE tipo!='superadmin' GROUP BY mes ORDER BY mes DESC LIMIT 6`),
            q(`SELECT u.nome, u.email, e.nome_empresa,
                      COUNT(a.id) total_agendamentos,
                      COUNT(c.id) total_clientes
               FROM usuarios u
               LEFT JOIN empresas e ON e.usuario_id=u.id
               LEFT JOIN agendamentos a ON a.usuario_id=u.id
               LEFT JOIN clientes c ON c.usuario_id=u.id
               WHERE u.tipo!='superadmin'
               GROUP BY u.id, u.nome, u.email, e.nome_empresa
               ORDER BY total_agendamentos DESC LIMIT 10`),
            q(`SELECT u.nome, u.email, al.ip, al.criado_em
               FROM audit_log al JOIN usuarios u ON u.id=al.usuario_id
               WHERE al.acao='LOGIN' ORDER BY al.criado_em DESC LIMIT 10`),
        ]);
        res.json({
            total_usuarios:     parseInt(tot_usr.rows[0].n),
            total_agendamentos: parseInt(tot_age.rows[0].n),
            total_clientes:     parseInt(tot_cli.rows[0].n),
            total_audits:       parseInt(tot_audit.rows[0].n),
            usuarios_ativos:    parseInt(ativos.rows[0].n),
            usuarios_inativos:  parseInt(inativos.rows[0].n),
            cadastros_por_mes:  por_mes.rows,
            agendamentos_por_usuario: agend_por_usr.rows,
            ultimos_logins:     ultimos_logins.rows,
        });
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// ========== SUPER ADMIN — USUÁRIOS ==========
app.get('/api/superadmin/usuarios', authSuper, async (req,res) => {
    try {
        const { rows } = await q(`
            SELECT u.id, u.nome, u.email, u.foto, u.tipo, u.ativo, u.data_cadastro,
                   e.nome_empresa,
                   (SELECT COUNT(*) FROM agendamentos WHERE usuario_id=u.id)::int total_agendamentos,
                   (SELECT COUNT(*) FROM clientes     WHERE usuario_id=u.id)::int total_clientes,
                   (SELECT COUNT(*) FROM servicos     WHERE usuario_id=u.id AND ativo=TRUE)::int total_servicos,
                   (SELECT MAX(criado_em) FROM audit_log WHERE usuario_id=u.id AND acao='LOGIN') ultimo_login
            FROM usuarios u
            LEFT JOIN empresas e ON e.usuario_id=u.id
            WHERE u.tipo!='superadmin'
            ORDER BY u.data_cadastro DESC
        `);
        res.json(rows);
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// Detalhes completos de um usuário
app.get('/api/superadmin/usuarios/:id', authSuper, async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({erro:'ID inválido'});

        const [usuario, agendamentos, clientes, servicos, colaboradores] = await Promise.all([
            q(`SELECT u.*, e.nome_empresa, e.cnpj, e.telefone, e.cidade, e.estado FROM usuarios u LEFT JOIN empresas e ON e.usuario_id=u.id WHERE u.id=$1`, [id]),
            q(`SELECT a.*, c.nome cliente_nome, s.nome servico_nome FROM agendamentos a
               LEFT JOIN clientes c ON c.id=a.cliente_id LEFT JOIN servicos s ON s.id=a.servico_id
               WHERE a.usuario_id=$1 ORDER BY a.data_agendamento DESC LIMIT 50`, [id]),
            q(`SELECT * FROM clientes WHERE usuario_id=$1 ORDER BY nome LIMIT 100`, [id]),
            q(`SELECT * FROM servicos WHERE usuario_id=$1 ORDER BY nome`, [id]),
            q(`SELECT * FROM colaboradores WHERE usuario_id=$1 ORDER BY nome`, [id]),
        ]);

        if (!usuario.rows[0]) return res.status(404).json({erro:'Usuário não encontrado'});
        res.json({
            usuario:      usuario.rows[0],
            agendamentos: agendamentos.rows,
            clientes:     clientes.rows,
            servicos:     servicos.rows,
            colaboradores:colaboradores.rows,
        });
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// Ativar/desativar usuário
app.put('/api/superadmin/usuarios/:id/status', authSuper, async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const { ativo } = req.body;
        if (!id) return res.status(400).json({erro:'ID inválido'});
        if (typeof ativo !== 'boolean') return res.status(400).json({erro:'Valor inválido'});
        await q(`UPDATE usuarios SET ativo=$1 WHERE id=$2 AND tipo!='superadmin'`, [ativo, id]);
        await audit(req.user.id, ativo?'USUARIO_ATIVADO':'USUARIO_DESATIVADO', `id:${id}`, req);
        res.json({mensagem: ativo ? 'Usuário ativado' : 'Usuário desativado'});
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// Alterar tipo/role do usuário
app.put('/api/superadmin/usuarios/:id/tipo', authSuper, async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const tipo = sanitize(req.body.tipo, 20);
        if (!id) return res.status(400).json({erro:'ID inválido'});
        if (!['gestor','admin'].includes(tipo)) return res.status(400).json({erro:'Tipo inválido'});
        await q(`UPDATE usuarios SET tipo=$1 WHERE id=$2 AND tipo!='superadmin'`, [tipo, id]);
        await audit(req.user.id, 'USUARIO_TIPO_ALTERADO', `id:${id} tipo:${tipo}`, req);
        res.json({mensagem:'Tipo atualizado'});
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// ========== SUPER ADMIN — AUDIT LOG ==========
app.get('/api/superadmin/audit', authSuper, async (req,res) => {
    try {
        const pagina = Math.max(1, parseInt(req.query.pagina)||1);
        const limite = Math.min(100, parseInt(req.query.limite)||50);
        const offset = (pagina-1)*limite;
        const acao   = sanitize(req.query.acao, 50);
        const usuario_id = parseInt(req.query.usuario_id)||null;

        let where = 'WHERE 1=1';
        const params = [];
        if (acao) { params.push('%'+acao+'%'); where += ` AND al.acao ILIKE $${params.length}`; }
        if (usuario_id) { params.push(usuario_id); where += ` AND al.usuario_id=$${params.length}`; }

        const totalRes = await q(`SELECT COUNT(*) n FROM audit_log al ${where}`, params);
        const { rows } = await q(`
            SELECT al.id, al.acao, al.detalhes, al.ip, al.criado_em,
                   u.nome usuario_nome, u.email usuario_email
            FROM audit_log al
            LEFT JOIN usuarios u ON u.id=al.usuario_id
            ${where}
            ORDER BY al.criado_em DESC
            LIMIT $${params.length+1} OFFSET $${params.length+2}
        `, [...params, limite, offset]);

        res.json({
            total: parseInt(totalRes.rows[0].n),
            pagina, limite,
            dados: rows,
        });
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// ========== PROTEGER APIs DE USUÁRIO ==========
['clientes','servicos','colaboradores','agendamentos','configuracoes','dashboard','aniversariantes','empresa']
    .forEach(r => app.use('/api/'+r, auth));

// ========== CLIENTES ==========
app.get('/api/clientes', async (req,res) => {
    try {
        const { rows } = await q('SELECT * FROM clientes WHERE usuario_id=$1 ORDER BY nome', [req.user.id]);
        res.json(rows);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.post('/api/clientes', async (req,res) => {
    const nome=sanitize(req.body.nome), email=sanitize(req.body.email),
          tel=sanitize(req.body.telefone,20), dn=sanitize(req.body.data_nascimento,10), end=sanitize(req.body.endereco);
    if (!nome) return res.status(400).json({erro:'Nome obrigatório'});
    if (email&&!isEmail(email)) return res.status(400).json({erro:'Email inválido'});
    if (dn&&!isDate(dn)) return res.status(400).json({erro:'Data inválida'});
    try {
        const { rows } = await q('INSERT INTO clientes (usuario_id,nome,email,telefone,data_nascimento,endereco) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [req.user.id,nome,email||null,tel||null,dn||null,end||null]);
        await audit(req.user.id,'CLIENTE_CRIADO','id:'+rows[0].id,req);
        res.status(201).json({mensagem:'Cliente cadastrado',id:rows[0].id});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.put('/api/clientes/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    const nome=sanitize(req.body.nome), email=sanitize(req.body.email),
          tel=sanitize(req.body.telefone,20), dn=sanitize(req.body.data_nascimento,10), end=sanitize(req.body.endereco);
    if (!nome) return res.status(400).json({erro:'Nome obrigatório'});
    if (email&&!isEmail(email)) return res.status(400).json({erro:'Email inválido'});
    try {
        const { rowCount } = await q('UPDATE clientes SET nome=$1,email=$2,telefone=$3,data_nascimento=$4,endereco=$5 WHERE id=$6 AND usuario_id=$7',
            [nome,email||null,tel||null,dn||null,end||null,id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Cliente atualizado'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.delete('/api/clientes/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    try {
        const { rowCount } = await q('DELETE FROM clientes WHERE id=$1 AND usuario_id=$2',[id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        await audit(req.user.id,'CLIENTE_REMOVIDO','id:'+id,req);
        res.json({mensagem:'Removido'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== SERVIÇOS ==========
app.get('/api/servicos', async (req,res) => {
    try {
        const { rows } = await q('SELECT * FROM servicos WHERE usuario_id=$1 AND ativo=TRUE ORDER BY nome',[req.user.id]);
        res.json(rows);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.post('/api/servicos', async (req,res) => {
    const nome=sanitize(req.body.nome), desc=sanitize(req.body.descricao),
          preco=Math.max(0,parseFloat(req.body.preco)||0), dur=Math.max(0,parseInt(req.body.duracao)||0);
    if (!nome) return res.status(400).json({erro:'Nome obrigatório'});
    try {
        const { rows } = await q('INSERT INTO servicos (usuario_id,nome,descricao,preco,duracao) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [req.user.id,nome,desc||null,preco,dur]);
        res.status(201).json({mensagem:'Serviço cadastrado',id:rows[0].id});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.put('/api/servicos/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    const nome=sanitize(req.body.nome), desc=sanitize(req.body.descricao),
          preco=Math.max(0,parseFloat(req.body.preco)||0), dur=Math.max(0,parseInt(req.body.duracao)||0),
          ativo=req.body.ativo===false||req.body.ativo===0?false:true;
    if (!nome) return res.status(400).json({erro:'Nome obrigatório'});
    try {
        const { rowCount } = await q('UPDATE servicos SET nome=$1,descricao=$2,preco=$3,duracao=$4,ativo=$5 WHERE id=$6 AND usuario_id=$7',
            [nome,desc||null,preco,dur,ativo,id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Serviço atualizado'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.delete('/api/servicos/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    try {
        const { rowCount } = await q('UPDATE servicos SET ativo=FALSE WHERE id=$1 AND usuario_id=$2',[id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Desativado'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== COLABORADORES ==========
app.get('/api/colaboradores', async (req,res) => {
    try {
        const { rows } = await q('SELECT * FROM colaboradores WHERE usuario_id=$1 AND ativo=TRUE ORDER BY nome',[req.user.id]);
        res.json(rows);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.post('/api/colaboradores', async (req,res) => {
    const nome=sanitize(req.body.nome), esp=sanitize(req.body.especialidade),
          tel=sanitize(req.body.telefone,20), email=sanitize(req.body.email), desc=sanitize(req.body.descricao);
    if (!nome) return res.status(400).json({erro:'Nome obrigatório'});
    if (email&&!isEmail(email)) return res.status(400).json({erro:'Email inválido'});
    try {
        const { rows } = await q('INSERT INTO colaboradores (usuario_id,nome,especialidade,telefone,email,descricao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [req.user.id,nome,esp||null,tel||null,email||null,desc||null]);
        res.status(201).json({mensagem:'Colaborador cadastrado',id:rows[0].id});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.put('/api/colaboradores/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    const nome=sanitize(req.body.nome), esp=sanitize(req.body.especialidade),
          tel=sanitize(req.body.telefone,20), email=sanitize(req.body.email), desc=sanitize(req.body.descricao);
    if (!nome) return res.status(400).json({erro:'Nome obrigatório'});
    if (email&&!isEmail(email)) return res.status(400).json({erro:'Email inválido'});
    try {
        const { rowCount } = await q('UPDATE colaboradores SET nome=$1,especialidade=$2,telefone=$3,email=$4,descricao=$5 WHERE id=$6 AND usuario_id=$7',
            [nome,esp||null,tel||null,email||null,desc||null,id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Colaborador atualizado'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.delete('/api/colaboradores/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    try {
        const { rowCount } = await q('UPDATE colaboradores SET ativo=FALSE WHERE id=$1 AND usuario_id=$2',[id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Desativado'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== AGENDAMENTOS ==========
app.get('/api/agendamentos', async (req,res) => {
    try {
        const {data_inicio,data_fim}=req.query;
        let sql=`SELECT a.id,a.data_agendamento,a.hora_agendamento,a.status,a.observacoes,a.data_criacao,
            c.nome cliente_nome,c.telefone cliente_telefone,
            s.nome servico_nome,s.preco,col.nome colaborador_nome
            FROM agendamentos a
            LEFT JOIN clientes c ON a.cliente_id=c.id
            LEFT JOIN servicos s ON a.servico_id=s.id
            LEFT JOIN colaboradores col ON a.colaborador_id=col.id
            WHERE a.usuario_id=$1`;
        const p=[req.user.id];
        if(data_inicio&&isDate(data_inicio)){p.push(data_inicio);sql+=` AND a.data_agendamento>=$${p.length}`;}
        if(data_fim&&isDate(data_fim)){p.push(data_fim);sql+=` AND a.data_agendamento<=$${p.length}`;}
        sql+=' ORDER BY a.data_agendamento DESC,a.hora_agendamento DESC LIMIT 500';
        const { rows } = await q(sql,p);
        res.json(rows);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.post('/api/agendamentos', async (req,res) => {
    const cid=parseInt(req.body.cliente_id), sid=parseInt(req.body.servico_id),
          colid=req.body.colaborador_id?parseInt(req.body.colaborador_id):null,
          data=sanitize(req.body.data_agendamento,10), hora=sanitize(req.body.hora_agendamento,5),
          obs=sanitize(req.body.observacoes,1000);
    if(!cid) return res.status(400).json({erro:'Cliente inválido'});
    if(!sid) return res.status(400).json({erro:'Serviço inválido'});
    if(!data||!isDate(data)) return res.status(400).json({erro:'Data inválida'});
    if(!hora||!isHora(hora)) return res.status(400).json({erro:'Hora inválida'});
    try {
        const cli = await q('SELECT id FROM clientes WHERE id=$1 AND usuario_id=$2',[cid,req.user.id]);
        if (!cli.rowCount) return res.status(403).json({erro:'Cliente não autorizado'});
        const svc = await q('SELECT id FROM servicos WHERE id=$1 AND usuario_id=$2 AND ativo=TRUE',[sid,req.user.id]);
        if (!svc.rowCount) return res.status(403).json({erro:'Serviço não autorizado'});
        const { rows } = await q('INSERT INTO agendamentos (usuario_id,cliente_id,servico_id,colaborador_id,data_agendamento,hora_agendamento,observacoes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            [req.user.id,cid,sid,colid,data,hora,obs||null]);
        await audit(req.user.id,'AGENDAMENTO_CRIADO','id:'+rows[0].id,req);
        res.status(201).json({mensagem:'Agendamento criado',id:rows[0].id});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.put('/api/agendamentos/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    const STATUS=['pendente','confirmado','cancelado','concluido'];
    const status=sanitize(req.body.status,20);
    if(!STATUS.includes(status)) return res.status(400).json({erro:'Status inválido'});
    try {
        const { rowCount } = await q('UPDATE agendamentos SET status=$1 WHERE id=$2 AND usuario_id=$3',[status,id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Atualizado'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.delete('/api/agendamentos/:id', async (req,res) => {
    const id=parseInt(req.params.id); if(!id) return res.status(400).json({erro:'ID inválido'});
    try {
        const { rowCount } = await q('DELETE FROM agendamentos WHERE id=$1 AND usuario_id=$2',[id,req.user.id]);
        if (!rowCount) return res.status(404).json({erro:'Não encontrado'});
        res.json({mensagem:'Removido'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== DASHBOARD ==========
app.get('/api/dashboard', async (req,res) => {
    try {
        const hoje=new Date().toISOString().split('T')[0];
        const mes=String(new Date().getMonth()+1).padStart(2,'0');
        const dia=String(new Date().getDate()).padStart(2,'0');
        const { rows } = await q(`SELECT
            (SELECT COUNT(*)::int FROM clientes     WHERE usuario_id=$1) total_clientes,
            (SELECT COUNT(*)::int FROM servicos     WHERE usuario_id=$1 AND ativo=TRUE) total_servicos,
            (SELECT COUNT(*)::int FROM colaboradores WHERE usuario_id=$1 AND ativo=TRUE) total_colaboradores,
            (SELECT COUNT(*)::int FROM agendamentos WHERE usuario_id=$1 AND data_agendamento=$2) agendamentos_hoje,
            (SELECT COUNT(*)::int FROM agendamentos WHERE usuario_id=$1 AND status='pendente') agendamentos_pendentes,
            (SELECT COUNT(*)::int FROM clientes WHERE usuario_id=$1 AND data_nascimento IS NOT NULL
                AND TO_CHAR(data_nascimento,'MM-DD')=$3) aniversariantes_hoje`,
            [req.user.id, hoje, mes+'-'+dia]);
        res.json(rows[0]);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== ANIVERSARIANTES ==========
app.get('/api/aniversariantes', async (req,res) => {
    try {
        const mes=Math.min(12,Math.max(1,parseInt(req.query.mes)||new Date().getMonth()+1));
        const { rows } = await q(`SELECT id,nome,email,telefone,data_nascimento FROM clientes
            WHERE usuario_id=$1 AND data_nascimento IS NOT NULL AND EXTRACT(MONTH FROM data_nascimento)=$2
            ORDER BY EXTRACT(DAY FROM data_nascimento)`,
            [req.user.id, mes]);
        res.json(rows);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== EMPRESA ==========
app.get('/api/empresa', async (req,res) => {
    try {
        const { rows } = await q('SELECT * FROM empresas WHERE usuario_id=$1',[req.user.id]);
        res.json(rows[0]||{});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.put('/api/empresa', async (req,res) => {
    const C=['nome_empresa','cnpj','inscricao_estadual','atividade','endereco','cidade','estado','cep','telefone','email','site','descricao','cor_primaria','cor_secundaria'];
    const v=C.map(c=>sanitize(req.body[c]));
    try {
        const ex = await q('SELECT id FROM empresas WHERE usuario_id=$1',[req.user.id]);
        if (ex.rowCount) {
            await q('UPDATE empresas SET '+C.map((c,i)=>c+'=$'+(i+1)).join(',')+' WHERE usuario_id=$'+(C.length+1),
                [...v,req.user.id]);
        } else {
            await q('INSERT INTO empresas (usuario_id,'+C.join(',')+')'+'VALUES ($1,'+C.map((_,i)=>'$'+(i+2)).join(',')+')',
                [req.user.id,...v]);
        }
        res.json({mensagem:'Empresa salva'});
    } catch(e) { console.error(e); res.status(500).json({erro:'Erro interno'}); }
});

// ========== CONFIGURAÇÕES ==========
const CHAVES=['lembrete_horas','cancelamento_horas','notif_cliente','notif_empresa','permitir_recorrente','whatsapp'];
app.get('/api/configuracoes', async (req,res) => {
    try {
        const { rows } = await q('SELECT chave,valor FROM configuracoes WHERE usuario_id=$1',[req.user.id]);
        const cfg={}; rows.forEach(r=>{cfg[r.chave]=r.valor;}); res.json(cfg);
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});
app.put('/api/configuracoes', async (req,res) => {
    const ups=CHAVES.filter(c=>req.body[c]!==undefined).map(c=>[req.user.id,c,sanitize(String(req.body[c]),200)]);
    if (!ups.length) return res.status(400).json({erro:'Nenhuma configuração válida'});
    try {
        for (const [uid,c,v] of ups) {
            await q('INSERT INTO configuracoes (usuario_id,chave,valor) VALUES ($1,$2,$3) ON CONFLICT (usuario_id,chave) DO UPDATE SET valor=$3',
                [uid,c,v]);
        }
        res.json({mensagem:'Configurações salvas'});
    } catch(e) { res.status(500).json({erro:'Erro interno'}); }
});

// ========== PÁGINAS PROTEGIDAS ==========
app.get('/', auth, (_,res) => res.sendFile(path.join(__dirname,'public','index.html')));
app.get('/superadmin', authSuper, (_,res) => res.sendFile(path.join(__dirname,'public','superadmin.html')));

const PAGS={
    '/clientes':'pages/clientes.html', '/agendamentos':'pages/agendamentos.html',
    '/servicos':'pages/servicos.html', '/colaboradores':'pages/colaboradores.html',
    '/configuracoes':'configuracoes.html', '/configuracoes-avancadas':'configuracoes_avancadas.html',
    '/empresa':'empresa.html', '/aniversariantes':'aniversariantes.html',
};
Object.entries(PAGS).forEach(([r,f])=>app.get(r,auth,(req,res)=>{
    const fp=path.join(__dirname,'public',f);
    if(!fs.existsSync(fp)) return res.status(404).send('Página não encontrada');
    res.sendFile(fp);
}));

// ========== 404 API ==========
app.use('/api/',(req,res)=>res.status(404).json({erro:'Endpoint não encontrado'}));

// ========== ERRO GLOBAL ==========
app.use((err,req,res,next)=>{
    console.error('Erro global:',err.message);
    if(req.path.startsWith('/api/')) return res.status(500).json({erro:'Erro interno do servidor'});
    res.status(500).send('Erro interno');
});

// ========== SHUTDOWN ==========
const shutdown=()=>{pool.end(()=>process.exit(0));setTimeout(()=>process.exit(1),5000);};
process.on('SIGTERM',shutdown);
process.on('SIGINT',shutdown);

// ========== START ==========
initDB()
    .then(()=>app.listen(PORT,()=>{
        console.log('AgendaPro porta '+PORT+' ['+NODE_ENV+']');
        console.log('Super Admin: '+SUPER_ADMIN_EMAIL);
        console.log('OAuth: '+BASE_URL+'/auth/google');
    }))
    .catch(e=>{ console.error('Erro ao iniciar:',e); process.exit(1); });
