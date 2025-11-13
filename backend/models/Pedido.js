const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario"); // Importa antes de definir o model

const Pedido = sequelize.define("Pedido", {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: "id_usuario",
    },
  },
  data_pedido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status_pedido: {
    type: DataTypes.ENUM('Pendente', 'Pago', 'Aprovado', 'Em transporte', 'Entregue', 'Cancelado'),
    defaultValue: "Pendente",
  },
  vl_total_pedido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: "pedidos",
  timestamps: false,
});

module.exports = Pedido;
