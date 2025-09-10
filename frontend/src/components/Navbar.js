import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background: "#282c34",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white"
    }}>
      <h3 style={{ margin: 0 }}>E-Commerce</h3>
      <div>
        <Link to="/login" style={{ color: "white", marginRight: "15px", textDecoration: "none" }}>Login</Link>
        <Link to="/cadastro" style={{ color: "white", marginRight: "15px", textDecoration: "none" }}>Cadastro</Link>
        <Link to="/recuperar-senha" style={{ color: "white", textDecoration: "none" }}>Recuperar Senha</Link>
      </div>
    </nav>
  );
}
