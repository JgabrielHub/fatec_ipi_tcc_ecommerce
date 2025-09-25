import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <h3 style={{ margin: 0 }}>E-Commerce</h3>
      <div className="container-fluid">
      <a className="navbar-brand" href="#">
          Ecommerce-TCC
      </a>
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
              <a className="nav-link active" aria-current="page" href="#">
                Início
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/recuperar-senha">
                Recuperar Senha
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/cadastro">
                Cadastro
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
    </div>
    </nav>
  );
}
