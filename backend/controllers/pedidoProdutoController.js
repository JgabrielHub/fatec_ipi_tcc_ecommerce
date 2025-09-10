const PedidoProduto = require("../models/PedidoProduto");

module.exports = {
  async create(req, res) {
    try {
      const pedidoProduto = await PedidoProduto.create(req.body);
      res.status(201).json(pedidoProduto);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const itens = await PedidoProduto.findAll();
      res.json(itens);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const item = await PedidoProduto.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Item não encontrado" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const item = await PedidoProduto.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Item não encontrado" });
      await item.update(req.body);
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const item = await PedidoProduto.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Item não encontrado" });
      await item.destroy();
      res.json({ message: "Item removido do pedido" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
