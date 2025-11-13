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
    allowNull: true
    // Deixe sem unique se pode ser nulo
  },
  nome_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email_usuario: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: {
      name: 'unique_email_usuario', // nome fixo evita duplicar índice
      msg: 'Este e-mail já está cadastrado.'
    }
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
