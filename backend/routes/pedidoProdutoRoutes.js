const express = require("express");
const router = express.Router();
const { PedidoProduto } = require("../models");

router.post("/", async (req, res) => {
  try {
    const novoItem = await PedidoProduto.create(req.body);
    res.status(201).json(novoItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const itens = await PedidoProduto.findAll();
    res.json(itens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await PedidoProduto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const item = await PedidoProduto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await PedidoProduto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    await item.destroy();
    res.json({ message: "Item removido do pedido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
