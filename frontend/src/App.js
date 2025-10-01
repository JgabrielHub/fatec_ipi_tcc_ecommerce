import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import EditarPerfil from "./pages/EditarPerfil";
import Navbar from "./components/Navbar";
import Vitrine from "./pages/Vitrine";
import Produto from "./pages/Produto";
import Personalizar from "./pages/Personalizar";
import Carrinho from "./pages/Carrinho";
import Checkout from "./context/Checkout";
import { CarrinhoProvider } from "./context/CarrinhoContext";

function App() {
  return (
    <CarrinhoProvider>
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Vitrine />} />
          <Route path="/vitrine" element={<Vitrine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/perfil" element={<EditarPerfil />} />
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/personalizar/:id" element={<Personalizar />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </div>
    </Router>
</CarrinhoProvider>
  );
}

export default App;
