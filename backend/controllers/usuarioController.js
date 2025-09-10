const Usuario = require("../models/Usuario");

module.exports = {
  async listar(req, res) {
    const users = await Usuario.findAll();
    res.json(users);
  },

  async criar(req, res) {
    try {
      const novoUser = await Usuario.create(req.body);
      res.json(novoUser);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    await Usuario.update(req.body, { where: { id_usuario: id } });
    res.json({ message: "Usuário atualizado com sucesso" });
  },

  async deletar(req, res) {
    const { id } = req.params;
    await Usuario.destroy({ where: { id_usuario: id } });
    res.json({ message: "Usuário removido" });
  }
};
