const { DataTypes } = require('sequelize');
const sequelize = require('../infrastructure/database');

const Product = sequelize.define('Product', {
  nome: { type: DataTypes.STRING, allowNull: false },
  preco: { type: DataTypes.FLOAT, allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false } // Ex: Lanche, Bebida, Sobremesa
});

module.exports = Product;
