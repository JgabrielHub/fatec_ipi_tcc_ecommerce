const Pagamento = require("../models/Pagamento");

module.exports = {
  async create(req, res) {
    try {
      const pagamento = await Pagamento.create(req.body);
      res.status(201).json(pagamento);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const pagamentos = await Pagamento.findAll();
      res.json(pagamentos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const pagamento = await Pagamento.findByPk(req.params.id);
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
      res.json(pagamento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const pagamento = await Pagamento.findByPk(req.params.id);
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
      await pagamento.update(req.body);
      res.json(pagamento);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const pagamento = await Pagamento.findByPk(req.params.id);
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
      await pagamento.destroy();
      res.json({ message: "Pagamento excluído com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
