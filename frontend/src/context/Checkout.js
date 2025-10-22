import React, { useState } from "react";
import { useCarrinho } from "../context/CarrinhoContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { carrinho, totalCarrinho, limparCarrinho } = useCarrinho();
  const { user } = useAuth();

  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [frete, setFrete] = useState(0);
  const [prazo, setPrazo] = useState("");

  const calcularFrete = () => {
    setFrete(19.9);
    setPrazo("5 a 7 dias úteis");
  };

  const handleFinalizarCompra = async () => {
    if (!metodoPagamento || !endereco) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    if (!user?.id_usuario) {
      alert("Você precisa estar logado para finalizar a compra!");
      return;
    }

    const id_usuario = user?.id_usuario; // <- cuidado aqui

    console.log("🔍 Enviando checkout:", {
      id_usuario,
      carrinho,
      metodo_pagamento: metodoPagamento,
      endereco,
      frete,
      prazo,
      total: totalCarrinho + frete,
    });

    try {
      const response = await fetch("http://localhost:5000/pedidos/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          id_usuario: user.id_usuario,
          carrinho,
          metodo_pagamento: metodoPagamento,
          endereco,
          frete,
          prazo,
          total: totalCarrinho + frete,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Pedido realizado com sucesso!");
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

      <ul className="list-group mb-4">
        {carrinho.map((item, i) => (
          <li
            key={i}
            className="list-group-item d-flex justify-content-between"
          >
            <div>
              <strong>{item.produto.nm_produto}</strong> × {item.qtd}
            </div>
            <span>R$ {(item.precoUnitario * item.qtd).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="mb-3">
        <label className="form-label">Endereço de entrega</label>
        <input
          className="form-control"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Rua, número, bairro, cidade"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Método de Pagamento</label>
        <select
          className="form-select"
          value={metodoPagamento}
          onChange={(e) => setMetodoPagamento(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="cartao">Cartão de Crédito</option>
          <option value="boleto">Boleto</option>
          <option value="pix">Pix</option>
        </select>
        <div className="mt-3">
          {metodoPagamento === "cartao" && (
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Número do Cartão"
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nome no Cartão"
              />
              <div className="d-flex">
                {" "}
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Validade"
                />
                <input type="text" className="form-control" placeholder="CVV" />
              </div>
            </div>
          )}
          {metodoPagamento === "boleto" && (
            <p>
              Você receberá o boleto no seu e-mail após a confirmação do pedido.
            </p>
          )}
          {metodoPagamento === "pix" && (
            <p>
              Você receberá as instruções para pagamento via Pix após a
              confirmação do pedido.
            </p>
          )}
        </div>
        <div>
          <label className="form-label">Cálculo de Frete</label>
          <input
            type="text"
            className="form-control"
            placeholder="Digite seu CEP"
          />
        </div>
      </div>

      <button className="btn btn-outline-primary mb-3" onClick={calcularFrete}>
        Calcular Frete
      </button>

      {frete > 0 && (
        <p>
          Frete: <strong>R$ {frete.toFixed(2)}</strong> — Prazo: {prazo}
        </p>
      )}

      <h4 className="text-end">
        Total: R$ {(totalCarrinho + frete).toFixed(2)}
      </h4>

      <div className="text-end mt-3">
        <button className="btn btn-success" onClick={handleFinalizarCompra}>
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}
