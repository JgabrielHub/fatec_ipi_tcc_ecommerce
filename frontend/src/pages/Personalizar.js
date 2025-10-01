import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";

export default function Personalizar() {
  const { id } = useParams(); // id do produto
  const navigate = useNavigate();
  const { adicionarProduto } = useCarrinho();

  const [produto, setProduto] = useState(null);
  const [personalizacoes, setPersonalizacoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    // Buscar produto
    fetch(`http://localhost:5000/produtos/${id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.error("Erro ao carregar produto:", err));

    // Buscar personalizações disponíveis para esse produto
    fetch(`http://localhost:5000/personalizacoes?produto=${id}`)
      .then((res) => res.json())
      .then((data) => {
        // adiciona campos extras para input do usuário
        const persComExtras = data.map((p) => ({
          ...p,
          valor: "", // valor digitado pelo usuário
          opcao: "",  // para opções como tamanho/cor
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
    adicionarProduto({
      id_produto: produto.id_produto,
      nm_produto: produto.nm_produto,
      preco_produto: Number(produto.preco_produto),
    }, 1, selecionadas);

    navigate("/carrinho");
  };

  if (!produto) return <div className="text-center mt-5">⏳ Carregando...</div>;

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2>Personalizar: {produto.nm_produto}</h2>
        <p>{produto.desc_produto}</p>
        <p className="fw-bold">Preço base: R$ {Number(produto.preco_produto).toFixed(2)}</p>

        <h4 className="mt-3">Opções de Personalização</h4>
        {personalizacoes.length === 0 && <p>Nenhuma personalização disponível.</p>}

        <ul className="list-group">
          {personalizacoes.map((p) => (
            <li key={p.id_personalizacao} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span>{p.tipo_personalizacao} (+R$ {Number(p.vl_personalizacao).toFixed(2)})</span>
                  {p.tipo_personalizacao.toLowerCase().includes("texto") && (
                    <input
                      type="text"
                      placeholder="Digite seu texto"
                      value={p.valor}
                      className="form-control mt-1"
                      onChange={(e) => handleChange(p.id_personalizacao, "valor", e.target.value)}
                    />
                  )}
                  {p.tipo_personalizacao.toLowerCase().includes("tamanho") && (
                    <select
                      className="form-select mt-1"
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
                      className="form-select mt-1" 
                      value={p.opcao}
                      onChange={(e) => handleChange(p.id_personalizacao, "opcao", e.target.value)}
                    >
                      <option value="Preto">Preto</option>
                      <option value="Branco">Branco</option>
                      <option value="Cinza">Cinza</option>
                      <option value="">Selecione cor</option>
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
                <input
                  type="checkbox"
                  checked={selecionadas.some(sp => sp.id_personalizacao === p.id_personalizacao)}
                  onChange={() => togglePersonalizacao(p)}
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="fw-bold mt-3">Preço total: R$ {precoTotal()}</p>

        <button className="btn btn-success mt-3" onClick={handleAdicionarAoCarrinho}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
