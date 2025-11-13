const Usuario = require("./Usuario");
const Pedido = require("./Pedido");
const Pagamento = require("./Pagamento");
const Produto = require("./Produto");
const Personalizacao = require("./Personalizacao");
const PedidoProduto = require("./PedidoProduto");
const ItemPersonalizacao = require("./ItemPersonalizacao");

// 📌 Relações

// Usuario → Pedido
Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Pedido → Pagamento
Pedido.hasMany(Pagamento, { foreignKey: "id_pedido" });
Pagamento.belongsTo(Pedido, { foreignKey: "id_pedido" });

// Produto → Personalizacao
Produto.hasMany(Personalizacao, { foreignKey: "id_produto" });
Personalizacao.belongsTo(Produto, { foreignKey: "id_produto" });

// Pedido → PedidoProduto
Pedido.hasMany(PedidoProduto, { foreignKey: "id_pedido" });
PedidoProduto.belongsTo(Pedido, { foreignKey: "id_pedido" });

// Produto → PedidoProduto
Pedido.hasMany(PedidoProduto, { foreignKey: "id_pedido", as: "itens" });
PedidoProduto.belongsTo(Pedido, { foreignKey: "id_pedido" });
PedidoProduto.belongsTo(Produto, { foreignKey: "id_produto", as: "produto" });

// PedidoProduto → ItemPersonalizacao
PedidoProduto.hasMany(ItemPersonalizacao, { foreignKey: "id_pedido_produto", as: "personalizacoes" });
ItemPersonalizacao.belongsTo(PedidoProduto, { foreignKey: "id_pedido_produto" });

// Personalizacao → ItemPersonalizacao
Personalizacao.hasMany(ItemPersonalizacao, { foreignKey: "id_personalizacao" });
ItemPersonalizacao.belongsTo(Personalizacao, { foreignKey: "id_personalizacao" });

module.exports = {
  Usuario,
  Pedido,
  Pagamento,
  Produto,
  Personalizacao,
  PedidoProduto,
  ItemPersonalizacao
};
