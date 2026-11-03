const { Sequelize } = require('sequelize');
const path = require('path');

// Cria o arquivo do banco de dados na raiz do projeto
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false // Deixa o terminal mais limpo
});

module.exports = sequelize;
