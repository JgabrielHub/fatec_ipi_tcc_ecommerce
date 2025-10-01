import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <h3 style={{ margin: 0 }}>PERSONALZA</h3>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Personalizados
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Início
              </Link>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cadastro">
                    Cadastro
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/carrinho">
                    Carrinho
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={logout}
                    style={{ textDecoration: "none" }}
                  >
                    Sair
                  </button>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/perfil">
                    Minha Conta
                  </Link>
                </li>
                
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
