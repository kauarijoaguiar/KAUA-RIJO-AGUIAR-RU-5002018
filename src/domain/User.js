const { DataTypes } = require('sequelize');
const sequelize = require('../infrastructure/database');

const User = sequelize.define('User', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false }, // Aqui salvaremos o HASH
  perfil: { 
    type: DataTypes.ENUM('ADMIN', 'GERENTE', 'CLIENTE', 'COZINHA'), 
    defaultValue: 'CLIENTE' 
  },
  // REQUISITO DO PROGRAMA DE FIDELIDADE (RF9)
  pontosFidelidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = User;
