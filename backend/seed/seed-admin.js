const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const Usuario = require("../models/Usuario");

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco bem sucedida.");

    const emailAdmin = "admin@loja.com";
    const senhaAdmin = "123456"; 
    const senhaHash = await bcrypt.hash(senhaAdmin, 10);

    // Verifica se já existe admin
    const existingAdmin = await Usuario.findOne({
      where: { email_usuario: emailAdmin }
    });

    if (existingAdmin) {
      console.log("Administrador já existe. Nenhuma ação necessária.");
      process.exit(0);
    }

    // Cria o administrador
    await Usuario.create({
      nome_usuario: "Admin",
      email_usuario: emailAdmin,
      senha_usuario: senhaHash,
      tipo_usuario: "admin",
      cpf_usuario: null,
      endereco_usuario: null
    });

    console.log("Administrador criado com sucesso!");
    console.log(`Email: ${emailAdmin}`);
    console.log(`Senha: ${senhaAdmin}`);
    process.exit(0);

  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    process.exit(1);
  }
}

createAdmin();
