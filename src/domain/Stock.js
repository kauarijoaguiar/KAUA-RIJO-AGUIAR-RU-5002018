const { DataTypes } = require('sequelize');
const sequelize = require('../infrastructure/database');
const Product = require('./Product');

const Stock = sequelize.define('Stock', {
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

// Relacionamento de Negócio: O estoque pertence a um Produto específico
Stock.belongsTo(Product, { foreignKey: 'id_produto' });

module.exports = Stock;
