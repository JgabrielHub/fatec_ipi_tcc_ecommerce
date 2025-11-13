const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// 🟩 Criar usuário
router.post("/", async (req, res) => {
  try {
    const { nome_usuario, email_usuario, senha_usuario, cpf_usuario, endereco_usuario } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email_usuario } });
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
    });

    res.status(201).json(novoUsuario);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(400).json({ error: err.message });
  }
});

// 🟩 Listar usuários
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟩 Buscar usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟩 Atualizar usuário (autenticado)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o ID do token é o mesmo do usuário a ser atualizado
    if (parseInt(id) !== req.user.id_usuario) {
      return res.status(403).json({ error: "Acesso negado. Você só pode alterar seus próprios dados." });
    }

    const { nome_usuario, email_usuario, senha_usuario, cpf_usuario, endereco_usuario } = req.body;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    let senhaHash = usuario.senha_usuario;
    if (senha_usuario) {
      senhaHash = await bcrypt.hash(senha_usuario, 10);
    }

    await usuario.update({
      nome_usuario: nome_usuario || usuario.nome_usuario,
      email_usuario: email_usuario || usuario.email_usuario,
      senha_usuario: senhaHash,
      cpf_usuario: cpf_usuario || usuario.cpf_usuario,
      endereco_usuario: endereco_usuario || usuario.endereco_usuario,
    });

    res.json({ message: "Usuário atualizado com sucesso", usuario });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// 🟩 Deletar usuário (autenticado)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) !== req.user.id_usuario) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuário removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟩 Login
router.post("/login", async (req, res) => {
  const { email_usuario, senha_usuario } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email_usuario } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha_usuario, usuario.senha_usuario);
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

    // 🔥 Gera o token JWT com id_usuario
    const token = jwt.sign({ id_usuario: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login bem-sucedido", token, usuario });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟩 Recuperar senha
router.post("/recuperar-senha", async (req, res) => {
  const { email_usuario, nova_senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email_usuario } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const senhaHash = await bcrypt.hash(nova_senha, 10);
    usuario.senha_usuario = senhaHash;
    await usuario.save();

    res.json({ message: "Senha atualizada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
