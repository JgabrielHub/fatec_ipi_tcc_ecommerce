// routes/PersonalizacaoRouter.js
const express = require("express");
const router = express.Router();
const Personalizacao = require("../models/Personalizacao");

// Listar personalizações (todas ou por produto)
router.get("/", async (req, res) => {
  try {
    const { produto } = req.query;

    if (produto) {
      // filtra por produto
      const personalizacoes = await Personalizacao.findAll({
        where: { id_produto: produto }
      });
      return res.json(personalizacoes);
    }

    // sem filtro → retorna todas
    const todas = await Personalizacao.findAll();
    res.json(todas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar personalizações" });
  }
});

module.exports = router;
