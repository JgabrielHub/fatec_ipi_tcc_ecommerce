const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const PedidoProduto = require("../models/PedidoProduto");
const ItemPersonalizacao = require("../models/ItemPersonalizacao");
const authMiddleware = require("../middleware/authMiddleware");

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
