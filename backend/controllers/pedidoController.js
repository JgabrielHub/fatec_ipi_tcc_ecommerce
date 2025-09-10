const Pedido = require("../models/Pedido");

module.exports = {
  async create(req, res) {
    try {
      const pedido = await Pedido.create(req.body);
      res.status(201).json(pedido);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const pedidos = await Pedido.findAll();
      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
      res.json(pedido);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
      await pedido.update(req.body);
      res.json(pedido);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
      await pedido.destroy();
      res.json({ message: "Pedido excluído com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
