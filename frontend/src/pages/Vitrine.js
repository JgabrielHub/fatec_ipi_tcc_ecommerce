import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function Vitrine() {
  const [produtos, setProdutos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");
        const url = searchQuery
          ? `http://localhost:5000/produtos/search/${searchQuery}`
          : "http://localhost:5000/produtos";
        const res = await axios.get(url);
        setProdutos(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProdutos();
  }, [location.search]);

  return (
    <div>
      <h2 className="fw-semibold">Vitrine</h2>
      <div className="col-12 col-sm-12 col-md-8 col-lg-9 mb-4">

        <div className="row g-4">
          {produtos.map((produto) => (
            <div className="col-12 col-sm-6 col-lg-4" key={produto.id_produto}>
              <div className="card shadow-sm h-100">
                <div
                  className="card-img-top bg-secondary"
                  style={{ height: "180px", borderRadius: "10px" }}
                ></div>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{produto.nm_produto}</h5>
                  <p className="card-text text-muted">{produto.desc_produto}</p>
                  <p className="fw-bold mb-2">R$ {produto.preco_produto}</p>
                
                </div>
                <div className="card-footer mt-auto">
                  <Link
                    to={`/produto/${produto.id_produto}`}
                    className="btn btn-primary mt-auto w-100"
                    >
                    Ver Produto
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Vitrine;
