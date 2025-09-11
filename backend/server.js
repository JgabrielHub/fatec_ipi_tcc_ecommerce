const express = require("express");
const app = express();
const sequelize = require("./config/database");
const cors = require("cors");
app.use(cors());

// Importa rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const personalizacaoRoutes = require("./routes/personalizacaoRoutes");
const pedidoProdutoRoutes = require("./routes/pedidoProdutoRoutes");

app.use(express.json());

// Conexão
sequelize.authenticate()
  .then(() => console.log("Banco conectado"))
  .catch(err => console.error("Erro:", err));

sequelize.sync({ alter: true });

// Usa rotas
app.use("/usuarios", usuarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/personalizacoes", personalizacaoRoutes);
app.use("/pedido-produtos", pedidoProdutoRoutes);

app.get("/", (req, res) => res.send("API rodando"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
