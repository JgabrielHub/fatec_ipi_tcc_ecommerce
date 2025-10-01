const express = require("express");
const router = express.Router();
const { Produto } = require("../models");

router.post("/", async (req, res) => {
  try {
    const novoProduto = await Produto.create(req.body);
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    await produto.update(req.body);
    res.json(produto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    await produto.destroy();
    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar produtos pelo nome
router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  try {
    const produtos = await Produto.findAll({
      where: {
        nm_produto: {
          [require("sequelize").Op.like]: `%${query}%` // busca parcial
        }
      }
    });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
