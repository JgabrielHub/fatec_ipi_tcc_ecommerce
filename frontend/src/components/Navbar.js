import React, { use } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-header ">
      <div
        className="container-fluid"
        style={{ paddingLeft: "90px", paddingRight: "45px" }}
      >
        <Link className="navbar-brand header-logo" to="/">
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
          <div className=" header-search">
            <SearchBar />
          </div>
          <ul className="navbar-nav ms-auto ">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Início
              </Link>
            </li>
            <li className="nav-item">
                  <Link className="nav-link" to="/carrinho">
                    Carrinho
                  </Link>
                  
            </li>
            {!user ? (
              <>
              
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary me-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-orange me-2" to="/cadastro">
                    Cadastro
                  </Link>
                </li>
                
              </>
            ) : (
              <>
                <ul class="navbar-nav">
                  <li class="nav-item dropdown">
                    <button
                      class="btn btn-primary dropdown-toggle "
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Minha Conta {user.nome_usuario}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-dark text-center">
                      <li>
                        <a class="dropdown-item nav-link" href="/pedidos">
                          Meus pedidos
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item nav-link" href="/perfil">
                          Alterar dados
                        </a>
                      </li>
                      <li>
                          <button
                            className="dropdown-item nav-link"
                            onClick={handleLogout}
                            style={{ textDecoration: "none" }}
                          >
                            Sair
                          </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            )}
            {user && user.tipo_usuario === "admin" && (
              <li className="nav-item">
                <Link className="nav-link btn btn-danger me-2" to="/admin/pedidos">
                  Painel Administrativo
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
