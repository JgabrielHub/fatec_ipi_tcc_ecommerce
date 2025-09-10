const Produto = require("../models/Produto");

module.exports = {
  async create(req, res) {
    try {
      const produto = await Produto.create(req.body);
      res.status(201).json(produto);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const produtos = await Produto.findAll();
      res.json(produtos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
      res.json(produto);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
      await produto.update(req.body);
      res.json(produto);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
      await produto.destroy();
      res.json({ message: "Produto excluído com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
