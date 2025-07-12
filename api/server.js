// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const softwareRoutes = require('./routes/software');
const cors = require('cors');

dotenv.config(); //Carrega variáveis de ambiente do .env

connectDB(); // Conecta ao banco de dados

const app = express();

// configuração do cors
app.use(cors());
app.use(express.json()); // Haboilita o parsing de JSON no corpo das requisições

app.get('/', (req, res) => {
    res.send('API Rodando!');
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/softwares', softwareRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`);
})

