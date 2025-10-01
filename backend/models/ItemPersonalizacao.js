const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pedido = require("./Pedido");

const ItemPersonalizacao = sequelize.define("ItemPersonalizacao", {
  id_item_personalizacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Pedido, key: "id_pedido" }
  },
  id_produto: { type: DataTypes.INTEGER, allowNull: false },
  tipo_personalizacao: { type: DataTypes.STRING(50), allowNull: false },
  vl_personalizacao: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  valor: { type: DataTypes.STRING(255), allowNull: true } // campo opcional para texto selecionado
}, {
  tableName: "item_personalizacoes",
  timestamps: false
});

module.exports = ItemPersonalizacao;
