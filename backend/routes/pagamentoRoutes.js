const express = require("express");
const router = express.Router();
const { Pagamento } = require("../models");

router.post("/", async (req, res) => {
  try {
    const novoPagamento = await Pagamento.create(req.body);
    res.status(201).json(novoPagamento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const pagamentos = await Pagamento.findAll();
    res.json(pagamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pagamento = await Pagamento.findByPk(req.params.id);
    if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
    res.json(pagamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const pagamento = await Pagamento.findByPk(req.params.id);
    if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
    await pagamento.update(req.body);
    res.json(pagamento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const pagamento = await Pagamento.findByPk(req.params.id);
    if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
    await pagamento.destroy();
    res.json({ message: "Pagamento removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
