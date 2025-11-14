const express = require("express");
const router = express.Router();

const Pedido = require("../../models/Pedido");
const PedidoProduto = require("../../models/PedidoProduto");
const ItemPersonalizacao = require("../../models/ItemPersonalizacao");
const Produto = require("../../models/Produto");
const Usuario = require("../../models/Usuario");

const authMiddleware = require("../../middleware/authMiddleware");
const isAdmin = require("../../middleware/adminMiddleware");

// ===================================================
// GET /admin/pedidos – Lista TODOS os pedidos
// ===================================================
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: PedidoProduto,
          as: "itens",
          include: [
            { model: Produto, as: "produto" },
            { model: ItemPersonalizacao, as: "personalizacoes" }
          ],
        },
        { model: Usuario, attributes: ["id_usuario", "nome_usuario", "email_usuario"] },
      ],
      order: [["id_pedido", "DESC"]],
    });

    return res.json({ pedidos });
  } catch (err) {
    console.error("Erro ao listar pedidos admin:", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// ===================================================
// PUT /admin/pedidos/:id/status – Atualizar status
// ===================================================
router.put("/:id/status", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const statusPermitidos = [
      "Pendente",
      "Pago",
      "Em Produção",
      "Em Transporte",
      "Entregue",
      "Cancelado",
    ];

    if (!statusPermitidos.includes(status))
      return res.status(400).json({ error: "Status inválido." });

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

    pedido.status_pedido = status;
    await pedido.save();

    return res.json({ message: "Status atualizado!", pedido });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

module.exports = router;
