const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define("Produto", {
  id_produto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nm_produto: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  desc_produto: {
    type: DataTypes.STRING(255)
  },
  preco_produto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  qtd_produto: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
 {
  tableName: "produtos",
  timestamps: false
});

module.exports = Produto;
