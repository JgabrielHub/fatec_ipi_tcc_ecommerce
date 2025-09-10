const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Criar usuário (com senha criptografada)
router.post("/", async (req, res) => {
  try {
    const { nome_usuario, email_usuario, senha_usuario, cpf_usuario, endereco_usuario } = req.body;

    const senhaHash = await bcrypt.hash(senha_usuario, 10);

    const novoUsuario = await Usuario.create({
      nome_usuario,
      email_usuario,
      senha_usuario: senhaHash,
      cpf_usuario,          // agora é opcional
      endereco_usuario      // idem
    });

    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar todos usuários
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar usuário (se trocar senha, criptografa novamente)
router.put("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    if (req.body.senha_usuario) {
      req.body.senha_usuario = await bcrypt.hash(req.body.senha_usuario, 10);
    }

    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar usuário
router.delete("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    await usuario.destroy();
    res.json({ message: "Usuário removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login de usuário
router.post("/login", async (req, res) => {
  const { email_usuario, senha_usuario } = req.body; 
  try {
    const usuario = await Usuario.findOne({ where: { email_usuario } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha_usuario, usuario.senha_usuario);
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: usuario.id_usuario }, "seu_segredo_jwt", { expiresIn: "1h" });
    res.json({ message: "Login bem-sucedido", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recuperação de senha (simples)
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
