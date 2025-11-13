import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Carregando...</span>
    </div>
    <span className="ms-3">Buscando seus pedidos...</span>
  </div>
);

export default function Pedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/pedidos", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPedidos(res.data.pedidos || []);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Falha ao buscar seus pedidos. " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [user]);

  // 🔹 Função para cancelar pedido
  const cancelarPedido = async (id_pedido) => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

    try {
      await axios.put(
        `http://localhost:5000/pedidos/${id_pedido}/cancelar`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Pedido cancelado com sucesso!");
      fetchPedidos(); // Recarrega os pedidos
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      alert("Falha ao cancelar o pedido.");
    }
  };

  const confirmarEntrega = async (id_pedido) => {
  if (!window.confirm("Deseja confirmar a entrega deste pedido?")) return;

  try {
    await axios.put(`http://localhost:5000/pedidos/${id_pedido}/entregar`, null, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setPedidos((prev) =>
      prev.map((p) =>
        p.id_pedido === id_pedido ? { ...p, status_pedido: "Entregue" } : p
      )
    );

    alert("Entrega confirmada com sucesso!");
  } catch (err) {
    console.error("Erro ao confirmar entrega:", err);
    alert("Erro ao confirmar entrega.");
  }
};

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;
    if (pedidos.length === 0)
      return <div className="alert alert-info mt-3">Nenhum pedido encontrado.</div>;

    return (
      <div className="mt-4">
        <ul className="list-group list-group-flush">
          {pedidos.map((pedido) => (
            <li key={pedido.id_pedido} className="list-group-item mb-3 shadow-sm border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Pedido #{pedido.id_pedido}</h5>
                <span
                  className={`badge bg-${
                    pedido.status_pedido === "Cancelado"
                      ? "danger"
                      : pedido.status_pedido === "Pago"
                      ? "info text-dark"
                      : pedido.status_pedido === "Em transporte"
                      ? "secondary text-white"
                      : pedido.status_pedido === "Entregue"
                      ? "primary"
                      : "warning"
                  }`}
                >
                  {pedido.status_pedido}
                </span>
              </div>

              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Data: {new Date(pedido.data_pedido).toLocaleDateString()}</span>
                <span className="fw-bold fs-6 text-dark">
                  Total: R$ {Number(pedido.vl_total_pedido).toFixed(2)}
                </span>
              </div>

              <ul className="mt-2">
                {pedido.itens.map((item) => {
                  const produtoNome = item.produto?.nm_produto || "Produto desconhecido";
                  const precoProduto = Number(item.produto?.preco_produto || 0);
                  const qtd = Number(item.qtd_pedido_produto || 1);

                  // soma personalizações
                  const totalPersonalizacoes = (item.personalizacoes || []).reduce(
                    (acc, p) => acc + Number(p.vl_personalizacao || 0),
                    0
                  );

                  const precoTotal = (precoProduto + totalPersonalizacoes) * qtd;

                  return (
                    <li key={item.id_pedido_produto} className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>
                          {produtoNome} x {qtd}
                        </span>
                        <span>R$ {precoTotal.toFixed(2)}</span>
                      </div>
                      {item.personalizacoes?.length > 0 && (
                        <ul className="ms-4 text-muted small">
                          {item.personalizacoes.map((p) => (
                            <li key={p.id_item_personalizacao}>
                              {p.valor_escolhido
                                ? `${p.valor_escolhido}`
                                : "Personalização"}{" "}
                              (R$ {Number(p.vl_personalizacao || 0).toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="d-flex justify-content-end mt-3 gap-2">
  {pedido.status_pedido === "Pendente" && (
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => cancelarPedido(pedido.id_pedido)}
    >
      Cancelar pedido
    </button>
  )}

  {(pedido.status_pedido === "Em transporte" || pedido.status_pedido === "Aprovado") && (
    <button
      className="btn btn-outline-success btn-sm"
      onClick={() => confirmarEntrega(pedido.id_pedido)}
    >
      Confirmar entrega
    </button>
  )}
</div>

            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container-lg my-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header text-white text-center">
              <h2 className="mb-0 card-title">Meus Pedidos</h2>
            </div>
            <div className="card-body p-4">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
