const express = require("express");
const router = express.Router();
const { Personalizacao } = require("../models");

router.post("/", async (req, res) => {
  try {
    const novaPersonalizacao = await Personalizacao.create(req.body);
    res.status(201).json(novaPersonalizacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const personalizacoes = await Personalizacao.findAll();
    res.json(personalizacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const personalizacao = await Personalizacao.findByPk(req.params.id);
    if (!personalizacao) return res.status(404).json({ error: "Personalização não encontrada" });
    res.json(personalizacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personalizacao = await Personalizacao.findByPk(req.params.id);
    if (!personalizacao) return res.status(404).json({ error: "Personalização não encontrada" });
    await personalizacao.update(req.body);
    res.json(personalizacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personalizacao = await Personalizacao.findByPk(req.params.id);
    if (!personalizacao) return res.status(404).json({ error: "Personalização não encontrada" });
    await personalizacao.destroy();
    res.json({ message: "Personalização removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
