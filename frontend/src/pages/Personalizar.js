import React, { useEffect, useState } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import { useAuth } from "../context/AuthContext";

export default function Personalizar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarProduto } = useCarrinho();
  const { user } = useAuth();

  const [produto, setProduto] = useState(null);
  const [personalizacoes, setPersonalizacoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/produtos/${id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.error("Erro ao carregar produto:", err));

    fetch(`http://localhost:5000/personalizacoes?produto=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const persComExtras = data.map((p) => ({
          ...p,
          valor: "",
          opcao: "",
        }));
        setPersonalizacoes(persComExtras);
      })
      .catch((err) => console.error("Erro ao carregar personalizações:", err));
  }, [id]);

  const handleChange = (id_personalizacao, campo, value) => {
    setPersonalizacoes((prev) =>
      prev.map((p) =>
        p.id_personalizacao === id_personalizacao
          ? { ...p, [campo]: value }
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
  // pega só as personalizações realmente selecionadas
  const selecionadasComValor = personalizacoes
    .filter((p) =>
      selecionadas.some((sp) => sp.id_personalizacao === p.id_personalizacao)
    )
    .map((p) => ({
      ...p,
      valor_escolhido: p.valor || p.opcao || "" // salva o texto ou opção escolhida
    }));

  adicionarProduto(
    {
      id_produto: produto.id_produto,
      nm_produto: produto.nm_produto,
      preco_produto: Number(produto.preco_produto),
    },
    1,
    selecionadasComValor
  );

  navigate("/carrinho");
};


  if (!produto) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg p-4 rounded-4">
        <div className="mb-4 text-center">
          <h2 className="fw-bold text-success">{produto.nm_produto}</h2>
          <p className="text-muted">{produto.desc_produto}</p>
          <span className="badge bg-success fs-5">
            Preço base: R$ {Number(produto.preco_produto).toFixed(2)}
          </span>
        </div>

        <div className="mb-3">
          <h4 className="fw-semibold text-secondary">Opções de Personalização</h4>
          {personalizacoes.length === 0 && (
            <p className="text-muted">Nenhuma personalização disponível.</p>
          )}
          <ul className="list-group list-group-flush">
            {personalizacoes.map((p) => (
              <li key={p.id_personalizacao} className="list-group-item py-3">
                <div className="row align-items-center">
                  <div className="col-md-9">
                    <span className="fw-semibold">
                      {p.tipo_personalizacao}
                      <span className="text-success ms-2">
                        (+R$ {Number(p.vl_personalizacao).toFixed(2)})
                      </span>
                    </span>
                    {p.tipo_personalizacao.toLowerCase().includes("texto") && (
                      <input
                        type="text"
                        placeholder="Digite seu texto"
                        value={p.valor}
                        className="form-control mt-2"
                        onChange={(e) => handleChange(p.id_personalizacao, "valor", e.target.value)}
                      />
                    )}
                    {p.tipo_personalizacao.toLowerCase().includes("tamanho") && (
                      <select
                        className="form-select mt-2"
                        value={p.opcao}
                        onChange={(e) => handleChange(p.id_personalizacao, "opcao", e.target.value)}
                      >
                        <option value="">Selecione tamanho</option>
                        <option value="P">P</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="GG">GG</option>
                      </select>
                    )}
                    {p.tipo_personalizacao.toLowerCase().includes("cor") && (
                      <select
                        className="form-select mt-2"
                        value={p.opcao}
                        onChange={(e) => handleChange(p.id_personalizacao, "opcao", e.target.value)}
                      >
                        <option value="">Selecione cor</option>
                        <option value="Preto">Preto</option>
                        <option value="Branco">Branco</option>
                        <option value="Cinza">Cinza</option>
                        <option value="Vermelho">Vermelho</option>
                        <option value="Azul">Azul</option>
                        <option value="Verde">Verde</option>
                        <option value="Amarelo">Amarelo</option>
                        <option value="Roxo">Roxo</option>
                        <option value="Laranja">Laranja</option>
                        <option value="Rosa">Rosa</option>
                      </select>
                    )}
                  </div>
                  <div className="col-md-3 text-end">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`pers-${p.id_personalizacao}`}
                        checked={selecionadas.some(sp => sp.id_personalizacao === p.id_personalizacao)}
                        onChange={() => togglePersonalizacao(p)}
                      />
                      <label className="form-check-label" htmlFor={`pers-${p.id_personalizacao}`}>
                        Selecionar
                      </label>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="fw-bold fs-5 text-success">
            Preço total: R$ {precoTotal()}
          </span>
          {!user ? (
            <Link to="/login" className="btn btn-primary">
            Faça login para adicionar ao carrinho
            </Link>
          ): (
            <button
            className="btn btn-success btn-lg px-4 rounded-pill shadow"
            onClick={handleAdicionarAoCarrinho}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Adicionar ao Carrinho
          </button>
          )}
          
        </div>
      </div>
    </div>
  );
}
