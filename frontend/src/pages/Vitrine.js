import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";

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
      <h2>Vitrine</h2>
      <SearchBar />
      <div className="row">
        {produtos.map((produto) => (
          <div className="col-md-4 mb-3" key={produto.id_produto}>
            <div className="card">
              <div className="card-body">
                <h5>{produto.nm_produto}</h5>
                <p>{produto.desc_produto}</p>
                <p>R$ {produto.preco_produto}</p>
                <Link to={`/produto/${produto.id_produto}`} className="btn btn-primary">
                  Ver Produto
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vitrine;
