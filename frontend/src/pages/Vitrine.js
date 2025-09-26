import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Vitrine() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🛍️ Nossa Vitrine</h2>
      <div className="row">
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <div className="col-md-4 mb-4" key={produto.id_produto}>
              <div className="card h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">{produto.nm_produto}</h5>
                  <p className="card-text">{produto.desc_produto}</p>
                  <p className="fw-bold">R$ {Number(produto.preco_produto).toFixed(2)}</p>
                  <Link
                    to={`/produto/${produto.id_produto}`}
                    className="btn btn-primary"
                  >
                    Ver Produto
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Nenhum produto disponível.</p>
        )}
      </div>
    </div>
  );
}
