import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default {
  async listar(_req, res) {
    try {
      const users = await Usuario.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  },

  async criar(req, res) {
    try {
      const { cpf_usuario, email_usuario } = req.body;

      // Verifica duplicidade de e-mail
      const usuarioEmail = await Usuario.findOne({ where: { email_usuario } });
      if (usuarioEmail) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      // Verifica duplicidade de CPF (se informado)
      if (cpf_usuario) {
        const usuarioCPF = await Usuario.findOne({ where: { cpf_usuario } });
        if (usuarioCPF) {
          return res.status(400).json({ error: "CPF já cadastrado." });
        }
      }

      const novoUser = await Usuario.create(req.body);
      res.status(201).json(novoUser);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { cpf_usuario, email_usuario } = req.body;

      // Verifica se o usuário existe
      const usuarioExistente = await Usuario.findByPk(id);
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Valida e-mail
      if (email_usuario && email_usuario !== usuarioExistente.email_usuario) {
        const usuarioEmail = await Usuario.findOne({ where: { email_usuario } });
        if (usuarioEmail) {
          return res.status(400).json({ error: "E-mail já cadastrado." });
        }
      }

      // Valida CPF
      if (cpf_usuario && cpf_usuario !== usuarioExistente.cpf_usuario) {
        const usuarioCPF = await Usuario.findOne({ where: { cpf_usuario } });
        if (usuarioCPF) {
          return res.status(400).json({ error: "CPF já cadastrado." });
        }
      }

      // Atualiza
      await Usuario.update(req.body, { where: { id_usuario: id } });

      // Busca o usuário atualizado e retorna
      const usuarioAtualizado = await Usuario.findByPk(id);
      res.json(usuarioAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const usuarioExistente = await Usuario.findByPk(id);
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      await Usuario.destroy({ where: { id_usuario: id } });
      res.json({ message: "Usuário removido" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  },

  async login(req, res) {
  const { email_usuario, senha_usuario } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email_usuario } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha_usuario, usuario.senha_usuario);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retorna o token + dados
    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome_usuario: usuario.nome_usuario,
        email_usuario: usuario.email_usuario
      }
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no servidor durante o login" });
  }
}

};
