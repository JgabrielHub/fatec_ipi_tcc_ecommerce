const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// ======================================================
// 🟩 Criar usuário (registro)
// ======================================================
router.post("/", async (req, res) => {
  try {
    const {
      nome_usuario,
      email_usuario,
      senha_usuario,
      cpf_usuario,
      endereco_usuario,
      tipo_usuario
    } = req.body;

    if (!nome_usuario || !email_usuario || !senha_usuario) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const usuarioExistente = await Usuario.findOne({
      where: { email_usuario }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha_usuario, 10);

    const novoUsuario = await Usuario.create({
      nome_usuario,
      email_usuario,
      senha_usuario: senhaHash,
      cpf_usuario,
      endereco_usuario,
      tipo_usuario: tipo_usuario || "cliente" // garante "cliente" por padrão
    });

    // Não retornar senha
    const usuarioSeguro = {
      id_usuario: novoUsuario.id_usuario,
      nome_usuario,
      email_usuario,
      cpf_usuario,
      endereco_usuario,
      tipo_usuario: novoUsuario.tipo_usuario
    };

    return res.status(201).json(usuarioSeguro);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🟩 Listar usuários (ADMIN)
// ======================================================
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["senha_usuario"] }
    });

    return res.json(usuarios);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🟩 Buscar usuário por ID (somente ADMIN ou o próprio user)
// ======================================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.tipo_usuario !== "admin" && req.user.id_usuario !== parseInt(id)) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["senha_usuario"] }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🟩 Atualizar usuário (somente o próprio usuário)
// ======================================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id_usuario) {
      return res.status(403).json({ error: "Você só pode atualizar sua própria conta" });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const {
      nome_usuario,
      email_usuario,
      senha_usuario,
      cpf_usuario,
      endereco_usuario
    } = req.body;

    let senhaHash = usuario.senha_usuario;

    if (senha_usuario) {
      senhaHash = await bcrypt.hash(senha_usuario, 10);
    }

    await usuario.update({
      nome_usuario: nome_usuario ?? usuario.nome_usuario,
      email_usuario: email_usuario ?? usuario.email_usuario,
      cpf_usuario: cpf_usuario ?? usuario.cpf_usuario,
      endereco_usuario: endereco_usuario ?? usuario.endereco_usuario,
      senha_usuario: senhaHash
    });

    return res.json({
      message: "Usuário atualizado com sucesso",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome_usuario: usuario.nome_usuario,
        email_usuario: usuario.email_usuario,
        cpf_usuario: usuario.cpf_usuario,
        endereco_usuario: usuario.endereco_usuario,
        tipo_usuario: usuario.tipo_usuario
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🟩 Deletar usuário (somente o próprio usuário)
// ======================================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id_usuario) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await usuario.destroy();

    return res.json({ message: "Usuário removido com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🟩 Login
// ======================================================
router.post("/login", async (req, res) => {
  const { email_usuario, senha_usuario } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email_usuario } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(
      senha_usuario,
      usuario.senha_usuario
    );

    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        tipo_usuario: usuario.tipo_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const usuarioSeguro = {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
      email_usuario: usuario.email_usuario,
      cpf_usuario: usuario.cpf_usuario,
      endereco_usuario: usuario.endereco_usuario,
      tipo_usuario: usuario.tipo_usuario
    };

    return res.json({
      message: "Login bem-sucedido",
      token,
      usuario: usuarioSeguro
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🟩 Recuperar senha
// ======================================================
router.post("/recuperar-senha", async (req, res) => {
  const { email_usuario, nova_senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email_usuario } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaHash = await bcrypt.hash(nova_senha, 10);

    usuario.senha_usuario = senhaHash;
    await usuario.save();

    return res.json({ message: "Senha atualizada com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
