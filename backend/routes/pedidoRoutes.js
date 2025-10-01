const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const PedidoProduto = require("../models/PedidoProduto");
const ItemPersonalizacao = require("../models/ItemPersonalizacao");

// Endpoint para checkout
router.post("/checkout", async (req, res) => {
  try {
    const { id_usuario, carrinho } = req.body;

    if (!id_usuario || !carrinho || !Array.isArray(carrinho)) {
      return res.status(400).json({ error: "ID do usuário e carrinho são obrigatórios" });
    }

    // Calcula valor total do pedido
    const vl_total_pedido = carrinho.reduce((acc, item) => {
      const precoPersonalizacoes = item.personalizacoes.reduce(
        (soma, p) => soma + Number(p.vl_personalizacao ?? 0),
        0
      );
      const precoUnitario = Number(item.produto.preco_produto ?? 0) + precoPersonalizacoes;
      return acc + precoUnitario * item.qtd;
    }, 0);

    // Cria pedido
    const novoPedido = await Pedido.create({
      id_usuario,
      vl_total_pedido,
      status_pedido: "Pendente"
    });

    // Adiciona produtos ao pedido
    for (const item of carrinho) {
      const pedidoProduto = await PedidoProduto.create({
        id_pedido: novoPedido.id_pedido,
        qtd_pedido_produto: item.qtd
      });

      // Adiciona personalizações
      for (const pers of item.personalizacoes) {
        await ItemPersonalizacao.create({
          id_pedido: novoPedido.id_pedido,
          id_produto: item.produto.id_produto,
          tipo_personalizacao: pers.tipo_personalizacao,
          vl_personalizacao: pers.vl_personalizacao,
          valor: pers.valor || null // campo opcional para texto digitado
        });
      }
    }

    res.status(201).json({ message: "Pedido criado com sucesso", pedido: novoPedido });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar checkout" });
  }
});

module.exports = router;
