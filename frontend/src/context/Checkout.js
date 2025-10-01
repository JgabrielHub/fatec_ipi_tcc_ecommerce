import React from "react";
import { useCarrinho } from "../context/CarrinhoContext";

export default function Checkout() {
  const {
    carrinho,
    removerProduto,
    atualizarQuantidade,
    totalCarrinho,
    limparCarrinho,
  } = useCarrinho();

  const handleFinalizarCompra = async () => {
    const id_usuario = 1; // Substitua pelo usuário logado

    try {
      const response = await fetch("http://localhost:5000/pedidos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, carrinho }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Pedido realizado com sucesso!");
        limparCarrinho();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Erro ao finalizar pedido");
    }
  };

  if (carrinho.length === 0)
    return <h3 className="text-center mt-5">🛒 Seu carrinho está vazio</h3>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Checkout</h2>

      <div className="list-group mb-4">
        {carrinho.map((item, index) => (
          <div
            key={index}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <h5>{item.produto.nm_produto}</h5>
              {item.personalizacoes.length > 0 && (
                <ul className="mb-1">
                  {item.personalizacoes.map((p) => (
                    <li key={p.id_personalizacao}>
                      {p.tipo_personalizacao}{" "}
                      {p.valor ? `: ${p.valor}` : ""} (+R$ {p.vl_personalizacao})
                    </li>
                  ))}
                </ul>
              )}
              <p className="mb-1">
                Preço unitário: R$ {item.precoUnitario.toFixed(2)}
              </p>
              <p className="mb-1">
                Subtotal: R$ {(item.precoUnitario * item.qtd).toFixed(2)}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  atualizarQuantidade(index, item.qtd - 1)
                }
              >
                -
              </button>
              <span>{item.qtd}</span>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  atualizarQuantidade(index, item.qtd + 1)
                }
              >
                +
              </button>
              <button
                className="btn btn-danger ms-3"
                onClick={() => removerProduto(index)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-end">
        <h4>Total: R$ {totalCarrinho.toFixed(2)}</h4>
        <button className="btn btn-success" onClick={handleFinalizarCompra}>
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}
