import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import { useAuth } from "../context/AuthContext";
import "../styles/produto.css";

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarProduto } = useCarrinho();
  const { user } = useAuth();

  const [produto, setProduto] = useState(null);
  const [personalizacoes, setPersonalizacoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  // Preview
  const [preview, setPreview] = useState({
    nome: "",
    cor: "Preto",
    tamanho: "M",
  });

  const coresDisponiveis = {
    Preto: "#000000",
    Branco: "#FFFFFF",
    Cinza: "#808080",
    Vermelho: "#FF0000",
    Azul: "#0000FF",
    Verde: "#008000",
    Amarelo: "#FFFF00",
    Rosa: "#FFC0CB",
  };

  useEffect(() => {
    fetch(`http://localhost:5000/produtos/${id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.error("Erro ao carregar produto:", err));

    fetch(`http://localhost:5000/personalizacoes?produto=${id}`)
      .then((res) => res.json())
      .then((data) =>
        setPersonalizacoes(
          data.map((p) => ({
            ...p,
            valor_escolhido: "",
            opcoes: p.opcoes ? p.opcoes.split(",") : null, // caso venha lista do banco
          }))
        )
      )
      .catch((err) => console.error("Erro ao carregar personalizações:", err));
  }, [id]);

  const handleChange = (id_personalizacao, valor) => {
    setPersonalizacoes((prev) =>
      prev.map((p) =>
        p.id_personalizacao === id_personalizacao
          ? { ...p, valor_escolhido: valor }
          : p
      )
    );
  };

  const togglePersonalizacao = (pers) => {
    if (selecionadas.find((p) => p.id_personalizacao === pers.id_personalizacao)) {
      setSelecionadas(selecionadas.filter((p) => p.id_personalizacao !== pers.id_personalizacao));
    } else {
      setSelecionadas([...selecionadas, pers]);
    }
  };

  const precoTotal = () => {
    const somaPersonalizacoes = selecionadas.reduce(
      (acc, p) => acc + Number(p.vl_personalizacao ?? 0),
      0
    );
    return (Number(produto?.preco_produto ?? 0) + somaPersonalizacoes).toFixed(2);
  };

  const handleAdicionarAoCarrinho = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const selecionadasComValor = personalizacoes.filter((p) =>
      selecionadas.some((sp) => sp.id_personalizacao === p.id_personalizacao)
    );

    adicionarProduto(produto, 1, selecionadasComValor);
    navigate("/carrinho");
  };

  if (!produto) {
    return <div className="text-center mt-5">⏳ Carregando produto...</div>;
  }

  const imageUrl =
    produto.imagem_produto || "https://via.placeholder.com/400x400?text=Sem+Imagem";

  return (
    <div className="product-page-container">
      {/* Coluna da Esquerda: Imagem */}
      <div className="image-container">
        <img
          src={imageUrl}
          alt={produto.nm_produto}
          className="product-image"
          style={{ filter: `drop-shadow(0 0 15px ${coresDisponiveis[preview.cor]})` }}
        />
        {preview.nome && <div className="image-text-overlay">{preview.nome}</div>}
      </div>

      {/* Coluna da Direita */}
      <div className="controls-container">
        <h2>{produto.nm_produto}</h2>
        <div className="product-price">
          <span className="tag">Preço Base:</span>
          R$ {Number(produto.preco_produto).toFixed(2)}
        </div>
        <hr />

        <h5>Opções de Personalização</h5>
        <ul className="list-group list-group-flush">
          {personalizacoes.map((p) => (
            <li key={p.id_personalizacao} className="list-group-item py-2"  >
              <div className="row align-items-center">
                <div className="col-md-8">
                  <span className="fw-semibold">
                    {p.tipo_personalizacao}
                    <span className="text-success ms-2">
                      (+R$ {Number(p.vl_personalizacao).toFixed(2)})
                    </span>
                  </span>

                  {/* Personalização dinâmica */}
                  {p.tipo_personalizacao.toLowerCase().includes("texto") ? (
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={p.valor_escolhido}
                      onChange={(e) => {
                        handleChange(p.id_personalizacao, e.target.value);
                        setPreview({ ...preview, nome: e.target.value });
                      }}
                      placeholder="Digite aqui"
                    />
                  ) : p.tipo_personalizacao.toLowerCase().includes("cor") ? (
                    <div className="color-swatches mt-2">
                      {Object.entries(coresDisponiveis).map(([nomeCor, codigoCor]) => (
                        <div
                          key={nomeCor}
                          className={`color-swatch ${preview.cor === nomeCor ? "selected" : ""}`}
                          style={{ backgroundColor: codigoCor }}
                          onClick={() => {
                            handleChange(p.id_personalizacao, nomeCor);
                            setPreview({ ...preview, cor: nomeCor });
                          }}
                          title={nomeCor}
                        ></div>
                      ))}
                    </div>
                  ) : p.tipo_personalizacao.toLowerCase().includes("tamanho") ? (
                    <select
                      className="form-select mt-2"
                      value={preview.tamanho}
                      onChange={(e) => {
                        handleChange(p.id_personalizacao, e.target.value);
                        setPreview({ ...preview, tamanho: e.target.value });
                      }}
                    >
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                    </select>
                  ) : p.opcoes && p.opcoes.length > 0 ? (
                    <select
                      className="form-select mt-2"
                      value={p.valor_escolhido}
                      onChange={(e) => handleChange(p.id_personalizacao, e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {p.opcoes.map((opt, i) => (
                        <option key={i} value={opt.trim()}>
                          {opt.trim()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={p.valor_escolhido}
                      onChange={(e) => handleChange(p.id_personalizacao, e.target.value)}
                      placeholder="Digite sua escolha"
                    />
                  )}
                </div>

                <div className="col-md-4 text-end">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`pers-${p.id_personalizacao}`}
                      checked={selecionadas.some(
                        (sp) => sp.id_personalizacao === p.id_personalizacao
                      )}
                      onChange={() => togglePersonalizacao(p)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`pers-${p.id_personalizacao}`}
                    >
                      Selecionar
                    </label>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="product-price mt-3">
          <span className="tag">Preço Total:</span> R$ {precoTotal()}
        </div>

        {!user ? (
          <Link to="/login" className="btn btn-primary mt-3">
            Faça login para adicionar ao carrinho
          </Link>
        ) : (
          <button
            className="btn btn-success btn-lg px-4 rounded-pill shadow mt-3"
            onClick={handleAdicionarAoCarrinho}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Adicionar ao Carrinho
          </button>
        )}

        <div className="description-box mt-4">
          <h6 className="fw-bold">Descrição:</h6>
          <p>{produto.desc_produto}</p>
        </div>
      </div>
    </div>
  );
}
