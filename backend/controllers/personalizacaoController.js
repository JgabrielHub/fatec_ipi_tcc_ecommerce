const Personalizacao = require("../models/Personalizacao");

module.exports = {
  async create(req, res) {
    try {
      const personalizacao = await Personalizacao.create(req.body);
      res.status(201).json(personalizacao);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const personalizacoes = await Personalizacao.findAll();
      res.json(personalizacoes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const personalizacao = await Personalizacao.findByPk(req.params.id);
      if (!personalizacao) return res.status(404).json({ error: "Personalização não encontrada" });
      res.json(personalizacao);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const personalizacao = await Personalizacao.findByPk(req.params.id);
      if (!personalizacao) return res.status(404).json({ error: "Personalização não encontrada" });
      await personalizacao.update(req.body);
      res.json(personalizacao);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const personalizacao = await Personalizacao.findByPk(req.params.id);
      if (!personalizacao) return res.status(404).json({ error: "Personalização não encontrada" });
      await personalizacao.destroy();
      res.json({ message: "Personalização excluída com sucesso" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
