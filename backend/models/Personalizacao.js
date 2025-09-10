const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Personalizacao = sequelize.define("Personalizacao", {
  id_personalizacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_produto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo_personalizacao: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  vl_personalizacao: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: "personalizacoes",
  timestamps: false
});

module.exports = Personalizacao;
