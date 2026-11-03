const express = require('express');
const sequelize = require('./infrastructure/database');

// Importação dos Modelos
const User = require('./domain/User');
const Product = require('./domain/Product');
const Order = require('./domain/Order');
const Stock = require('./domain/Stock'); // <-- ADICIONADO: Importação do modelo de estoque

// Importação das Rotas
const userRoutes = require('./api/userController');
const productRoutes = require('./api/productController');
const orderRoutes = require('./api/orderController');

const app = express();
app.use(express.json());

// Mensagem de boas-vindas
app.get('/', (req, res) => {
  res.send('API Rede Raízes do Nordeste - Sistema de Lanchonete Online 🚀');
});

// Ativação das Rotas
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

const PORT = 3000;

// Sincronização com o Banco de Dados
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado com sucesso!');
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}).catch(err => console.error('Erro de conexão:', err));
