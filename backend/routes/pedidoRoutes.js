const express = require("express");
const router = express.Router();

const Pedido = require("../models/Pedido");
const PedidoProduto = require("../models/PedidoProduto");
const ItemPersonalizacao = require("../models/ItemPersonalizacao");
const Produto = require("../models/Produto");

const authMiddleware = require("../middleware/authMiddleware");

// ===================================================
// GET /pedidos – Lista pedidos do usuário logado
// ===================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const pedidos = await Pedido.findAll({
      where: { id_usuario },
      include: [
        {
          model: PedidoProduto,
          as: "itens",
          include: [
            { model: Produto, as: "produto" },
            { model: ItemPersonalizacao, as: "personalizacoes" },
          ],
        },
      ],
      order: [["id_pedido", "DESC"]],
    });

    return res.json({ pedidos });
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// ===================================================
// PUT /pedidos/:id/cancelar – Cliente cancela pedido
// ===================================================
router.put("/:id/cancelar", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    const pedido = await Pedido.findOne({ where: { id_pedido: id, id_usuario } });

    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado." });
    if (pedido.status_pedido !== "Pendente")
      return res.status(400).json({ error: "Apenas pedidos pendentes podem ser cancelados." });

    pedido.status_pedido = "Cancelado";
    await pedido.save();

    return res.json({ message: "Pedido cancelado com sucesso!", pedido });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao cancelar pedido." });
  }
});

// ===================================================
// PUT /pedidos/:id/entregar – Cliente confirma entrega
// ===================================================
router.put("/:id/entregar", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id);

    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

    pedido.status_pedido = "Entregue";
    await pedido.save();

    return res.json({ message: "Entrega confirmada!", pedido });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao confirmar entrega" });
  }
});

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { carrinho } = req.body;
    const id_usuario = req.user.id_usuario; // vem do token JWT

    if (!id_usuario || !carrinho?.length) {
      return res.status(400).json({ error: "Usuário ou carrinho inválido" });
    }

    // Calcula o valor total do pedido
    const vl_total_pedido = carrinho.reduce((acc, item) => {
      const precoPersonalizacoes = (item.personalizacoes || []).reduce(
        (soma, p) => soma + Number(p.vl_personalizacao ?? 0),
        0
      );
      const precoUnitario =
        Number(item.produto?.preco_produto ?? 0) + precoPersonalizacoes;
      return acc + precoUnitario * (item.qtd ?? 1);
    }, 0);

    // Cria o pedido principal
    const novoPedido = await Pedido.create({
      id_usuario,
      vl_total_pedido,
      status_pedido: "Pendente",
    });

    // Adiciona os produtos e as personalizações associadas
    for (const item of carrinho) {
      const pedidoProduto = await PedidoProduto.create({
        id_pedido: novoPedido.id_pedido,
        id_produto: item.produto?.id_produto,
        qtd_pedido_produto: item.qtd ?? 1,
      });

      if (item.personalizacoes && item.personalizacoes.length > 0) {
        for (const pers of item.personalizacoes) {
          await ItemPersonalizacao.create({
            id_pedido_produto: pedidoProduto.id_pedido_produto,
            id_personalizacao: pers.id_personalizacao,
            valor_escolhido: pers.valor_escolhido || null,
            vl_personalizacao: pers.vl_personalizacao ?? 0,
          });
        }
      }
    }

    res.status(201).json({
      message: "Pedido criado com sucesso",
      pedido: novoPedido,
    });
  } catch (err) {
    console.error("Erro no checkout:", err);
    res
      .status(500)
      .json({ error: "Erro ao processar checkout", details: err.message });
  }
});
module.exports = router;
