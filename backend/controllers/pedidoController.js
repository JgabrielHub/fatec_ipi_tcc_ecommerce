const Pedido = require("../models/Pedido");
const PedidoProduto = require("../models/PedidoProduto");

module.exports = {
  async checkout(req, res) {
    try {
      const id_usuario = req.user?.id;
      const { carrinho, metodo_pagamento, endereco, frete, prazo, total } = req.body;

      // Validação básica
      if (!id_usuario || !carrinho || carrinho.length === 0) {
        return res.status(400).json({ error: "Usuário ou carrinho inválido" });
      }

      // Cria o pedido principal
      const novoPedido = await Pedido.create({
        id_usuario,
        metodo_pagamento,
        endereco_entrega: endereco,
        frete,
        prazo_entrega: prazo,
        total_pedido: total,
        status_pedido: "Em processamento",
        data_pedido: new Date(),
      });

      // Cria os produtos associados ao pedido
      for (const item of carrinho) {
        await PedidoProduto.create({
          id_pedido: novoPedido.id_pedido,
          id_produto: item.produto.id_produto,
          quantidade: item.qtd,
          preco_unitario: item.precoUnitario,
        });
      }

      res.status(201).json({
        message: "Pedido criado com sucesso!",
        pedido: novoPedido,
      });
    } catch (err) {
      console.error("Erro no checkout:", err);
      res.status(500).json({ error: "Erro ao processar pedido" });
    }
  },

  // Métodos antigos mantidos
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
