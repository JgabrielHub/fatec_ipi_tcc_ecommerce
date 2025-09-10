const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cpf_usuario: {
    type: DataTypes.CHAR(11),
    allowNull: true,   // ✅ Agora o CPF pode ser nulo
    unique: true
  },
  nome_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email_usuario: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  senha_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  endereco_usuario: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: "usuarios",
  timestamps: false
});

module.exports = Usuario;
