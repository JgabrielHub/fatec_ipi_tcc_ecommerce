const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const PedidoProduto = require("./PedidoProduto");
const Personalizacao = require("./Personalizacao");

const ItemPersonalizacao = sequelize.define("ItemPersonalizacao", {
  id_item_personalizacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pedido_produto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: PedidoProduto, key: "id_pedido_produto" },
  },
  id_personalizacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Personalizacao, key: "id_personalizacao" },
  },
  valor_escolhido: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
   vl_personalizacao: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "item_personalizacoes",
  timestamps: false,
});

module.exports = ItemPersonalizacao;
