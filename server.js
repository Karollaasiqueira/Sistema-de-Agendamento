const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares globais
app.use(cors());
app.use(express.json());

// 2. Rotas da API
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 3. Catch-all - rotas não encontradas retornam JSON (não HTML)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// 4. Middleware de erro (sempre por último)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Auth: http://localhost:${PORT}/api/auth`);
});

module.exports = app;
