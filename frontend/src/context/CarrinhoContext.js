import { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext();
export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarProduto = (produto, qtd = 1, personalizacoes = []) => {
    // Calcula o preço das personalizações
    const precoPersonalizacoes = personalizacoes.reduce(
      (acc, p) => acc + Number(p.vl_personalizacao ?? 0),
      0
    );

    const precoUnitario = Number(produto.preco_produto ?? 0) + precoPersonalizacoes;

    const itemExistente = carrinho.find(
      (i) =>
        i.produto.id_produto === produto.id_produto &&
        JSON.stringify(i.personalizacoes.map(p => p.id_personalizacao)) ===
        JSON.stringify(personalizacoes.map(p => p.id_personalizacao)) &&
        JSON.stringify(i.personalizacoes.map(p => p.valor || "")) ===
        JSON.stringify(personalizacoes.map(p => p.valor || ""))
    );

    if (itemExistente) {
      setCarrinho(prev =>
        prev.map(i =>
          i === itemExistente ? { ...i, qtd: i.qtd + qtd } : i
        )
      );
    } else {
      setCarrinho(prev => [
        ...prev,
        { produto, qtd, personalizacoes, precoUnitario }
      ]);
    }
  };

  const removerProduto = (index) => {
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const atualizarQuantidade = (index, novaQtd) => {
    if (novaQtd <= 0) return removerProduto(index);
    setCarrinho(prev =>
      prev.map((i, idx) => (idx === index ? { ...i, qtd: novaQtd } : i))
    );
  };

  const limparCarrinho = () => setCarrinho([]);

  const totalCarrinho = carrinho.reduce(
    (acc, i) => acc + i.precoUnitario * i.qtd,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarProduto,
        removerProduto,
        atualizarQuantidade,
        limparCarrinho,
        totalCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
