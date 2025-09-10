const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pedido = sequelize.define("Pedido", {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data_pedido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status_pedido: {
    type: DataTypes.ENUM("Pendente", "Pago", "Cancelado"),
    allowNull: false,
    defaultValue: "Pendente"
  },
  vl_total_pedido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: "pedidos",
  timestamps: false
});

module.exports = Pedido;
