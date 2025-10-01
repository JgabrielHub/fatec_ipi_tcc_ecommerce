import React from "react";
import { useCarrinho } from "../context/CarrinhoContext";

export default function Carrinho() {
  const { carrinho, removerProduto, atualizarQuantidade, limparCarrinho, totalCarrinho } = useCarrinho();

  if (carrinho.length === 0) {
    return <h3 className="text-center mt-5">🛒 Seu carrinho está vazio</h3>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Seu Carrinho</h2>
      <div className="list-group">
        {carrinho.map((item, index) => (
          <div key={index} className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row">
            <div>
              <h5>{item.produto.nm_produto}</h5>
              <p>Preço unitário: <strong>R$ {item.precoUnitario.toFixed(2)}</strong></p>
              {item.personalizacoes.length > 0 && (
                <ul>
                  {item.personalizacoes.map(p => (
                    <li key={p.id_personalizacao}>
                      {p.tipo_personalizacao}:{" "}
                      <strong>
                      {p.valor_escolhido || "Não informado"}
                       </strong>{" "}
                      (+R$ {Number(p.vl_personalizacao).toFixed(2)})
                    </li>
                  ))}
                </ul>
              )}
              <p>Subtotal: <strong>R$ {(item.precoUnitario * item.qtd).toFixed(2)}</strong></p>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
              <button className="btn btn-secondary" onClick={() => atualizarQuantidade(index, item.qtd - 1)}>-</button>
              <span>{item.qtd}</span>
              <button className="btn btn-secondary" onClick={() => atualizarQuantidade(index, item.qtd + 1)}>+</button>
              <button className="btn btn-danger ms-3" onClick={() => removerProduto(index)}>Remover</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-end">
        <h4>Total: R$ {totalCarrinho.toFixed(2)}</h4>
        <button className="btn btn-warning me-2" onClick={limparCarrinho}>Limpar Carrinho</button>
        <button className="btn btn-success">Finalizar Compra</button>
      </div>
    </div>
  );
}
