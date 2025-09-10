const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PedidoProduto = sequelize.define("PedidoProduto", {
  id_pedido_produto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_personalizacao: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  qtd_pedido_produto: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "pedido_produtos",
  timestamps: false
});

module.exports = PedidoProduto;
