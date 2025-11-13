const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pedido = require("./Pedido");
const Produto = require("./Produto");

const PedidoProduto = sequelize.define("PedidoProduto", {
  id_pedido_produto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pedido,
      key: "id_pedido",
    },
  },
  id_produto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produto,
      key: "id_produto",
    },
  },
  qtd_pedido_produto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "pedidos_produtos",
  timestamps: false,
});

module.exports = PedidoProduto;
