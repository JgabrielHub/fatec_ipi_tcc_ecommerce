const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pagamento = sequelize.define("Pagamento", {
  id_pagamento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vl_pagamento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tipo_pagamento: {
    type: DataTypes.ENUM("PIX", "Cartão"),
    allowNull: false
  },
  status_pagamento: {
    type: DataTypes.ENUM("Aprovado", "Rejeitado", "Pendente"),
    allowNull: false,
    defaultValue: "Pendente"
  }
}, {
  tableName: "pagamentos",
  timestamps: false
});

module.exports = Pagamento;
