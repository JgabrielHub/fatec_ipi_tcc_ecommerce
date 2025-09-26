import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Produto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/produtos/${id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.error("Erro ao carregar produto:", err));
  }, [id]);

  if (!produto) {
    return <div className="text-center mt-5">⏳ Carregando produto...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2>{produto.nm_produto}</h2>
        <p>{produto.desc_produto}</p>
        <p className="fw-bold">Preço: R$ {Number(produto.preco_produto).toFixed(2)}</p>
        <p>Estoque: {produto.qtd_produto}</p>

        <Link to={`/personalizar/${produto.id_produto}`} className="btn btn-warning me-2">
          Personalizar
        </Link>
        <button className="btn btn-success">Adicionar ao Carrinho</button>
      </div>
    </div>
  );
}
