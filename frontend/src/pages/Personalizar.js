import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Personalizar() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [personalizacoes, setPersonalizacoes] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/produtos/${id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.error("Erro ao carregar produto:", err));


    fetch(`http://localhost:5000/personalizacoes/${id}`)
      .then((res) => res.json())
      .then((data) => setPersonalizacoes(data))
      .catch((err) => console.error("Erro ao carregar personalizações:", err));
  }, [id]);

  if (!produto) {
    return <div className="text-center mt-5">⏳ Carregando personalização...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>🎨 Personalizar {produto.nm_produto}</h2>
      <p>{produto.desc_produto}</p>
      <p className="fw-bold">Preço base: R$ {Number(produto.preco_produto).toFixed(2)}</p>

      <h4 className="mt-4">Opções de Personalização:</h4>
      {personalizacoes.length > 0 ? (
        <ul className="list-group">
          {personalizacoes.map((perso) => (
            <li
              key={perso.id_personalizacao}
              className={`list-group-item ${selecionada === perso.id_personalizacao ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelecionada(perso.id_personalizacao)}
            >
              {perso.tipo_personalizacao} (+R$ {Number(perso.vl_personalizacao).toFixed(2)})
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma personalização disponível para este produto.</p>
      )}

      <div className="mt-4">
        <button className="btn btn-success">Adicionar ao Carrinho</button>
      </div>
    </div>
  );
}
