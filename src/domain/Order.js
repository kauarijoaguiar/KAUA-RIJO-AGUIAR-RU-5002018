const { DataTypes } = require('sequelize');
const sequelize = require('../infrastructure/database');

const Order = sequelize.define('Order', {
  clienteNome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Atende ao requisito de Multicanalidade 
  canalPedido: {
    type: DataTypes.ENUM('APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB'),
    allowNull: false
  },
  // Atende ao Fluxo de Status operacional
  status: {
    type: DataTypes.ENUM('AGUARDANDO_PAGAMENTO', 'PAGO', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO'),
    defaultValue: 'AGUARDANDO_PAGAMENTO'
  },
  valorTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Order;
