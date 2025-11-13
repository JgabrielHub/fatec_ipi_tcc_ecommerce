const express = require("express");
const app = express();
const sequelize = require("./config/database");
const cors = require("cors");
require("./models/index.js");
app.use(cors());
app.use(express.json());

// Importa rotas
const middleware = require("./middleware/authMiddleware");
const usuarioRoutes = require("./routes/usuarioRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const personalizacaoRoutes = require("./routes/personalizacaoRoutes");
const pedidoProdutoRoutes = require("./routes/pedidoProdutoRoutes");


// Conexão
sequelize.authenticate()
  .then(() => console.log("Banco conectado"))
  .catch(err => console.error("Erro ao conectar no banco:", err));

sequelize.sync({ alter: true })
  .then(() => console.log("Tabelas sincronizadas"))
  .catch(err => console.error("Erro ao sincronizar tabelas:", err));

// Usa rotas
app.use("/usuarios", usuarioRoutes);
app.use("/produtos", produtoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/personalizacoes", personalizacaoRoutes);
app.use("/pedido-produtos", pedidoProdutoRoutes);
app.use(middleware);

// Rota de teste
app.get("/", (req, res) => res.json({ message: "API rodando " }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
