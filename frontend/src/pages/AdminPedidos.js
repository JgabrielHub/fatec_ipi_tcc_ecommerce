import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AdminPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    if (!user || !user.token) return;

    try {
      const res = await axios.get("http://localhost:5000/admin/pedidos", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setPedidos(res.data.pedidos || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return; // aguarda usuário carregar
    fetchPedidos();
  }, [user]); // roda sempre que user for carregado

  const atualizarStatus = async (id, status) => {
    if (!user || !user.token) return;

    try {
      await axios.put(
        `http://localhost:5000/admin/pedidos/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      fetchPedidos();
      alert("Status do pedido atualizado!");
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Falha ao atualizar status.");
    }
  };

  // 🚫 Se user não existir, mostra aviso
  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center">
          Você precisa estar logado para acessar esta página.
        </div>
      </div>
    );
  }

  // 🚫 Se user NÃO for admin, bloqueia
  if (user.tipo_usuario !== "admin") {
    return (
      <div className="container py-4">
        <div className="alert alert-warning text-center">
          Acesso negado. Esta área é exclusiva para administradores.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="card-title">Painel Administrativo - Pedidos</h2>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <ul className="list-group mt-4">
          {pedidos.map((p) => (
            <li key={p.id_pedido} className="list-group-item shadow-sm mb-3">
              <div className="d-flex justify-content-between">
                <strong>Pedido #{p.id_pedido}</strong>
                <span
                  className={`badge bg-${
                    p.status_pedido === "Cancelado"
                      ? "danger"
                      : p.status_pedido === "Pago"
                      ? "info text-dark"
                      : p.status_pedido === "Em Transporte"
                      ? "primary"
                      : p.status_pedido === "Entregue"
                      ? "success"
                      : p.status_pedido === "Pendente"
                      ? "secondary"
                      : "warning"
                  }`}
                >
                  {p.status_pedido}
                </span>
              </div>
              <div className="mt-2">
                <strong>Cliente:</strong>{" "}
                {p.Usuario
                  ? `${p.Usuario.nome_usuario} (${p.Usuario.email_usuario})`
                  : "Usuário desconhecido"}
              </div>
              <div className="mt-1">
                <strong>Data do Pedido:</strong>{" "}
                {new Date(p.data_pedido).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="d-flex justify-content-between">
                <strong>Valor Total:</strong>
                <span className="fw-bold">
                  R$ {Number(p.vl_total_pedido).toFixed(2)}
                </span>
              </div>
              <div className="mt-2">
                <strong>Itens do Pedido:</strong>
                <ul className="mt-2">
                  {p.itens.map((item) => {
                    const nomeProduto =
                      item.produto?.nm_produto || "Produto desconhecido";
                    const preco = Number(item.produto?.preco_produto || 0);
                    const qtd = Number(item.qtd_pedido_produto || 1);


                    return (
                      <li key={item.id_pedido_produto} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <span>
                            {nomeProduto} x {qtd}
                          </span>
                          <span>R$ {preco.toFixed(2)}</span>
                        </div>

                        {item.personalizacoes?.length > 0 && (
                          <ul className="ms-4 text-muted small">
                            {item.personalizacoes.map((pers) => (
                              <li key={pers.id_item_personalizacao}>
                                {pers.valor_escolhido || "Personalização"} — R$
                                {Number(pers.vl_personalizacao || 0).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-3 d-flex gap-2">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => atualizarStatus(p.id_pedido, "Pago")}
                >
                  Marcar como Pago
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => atualizarStatus(p.id_pedido, "Pendente")}
                >
                  Marcar como Pendente
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => atualizarStatus(p.id_pedido, "Em Produção")}
                >
                  Em Produção
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => atualizarStatus(p.id_pedido, "Em Transporte")}
                >
                  Enviar Pedido
                </button>

                <button
                  className="btn btn-success btn-sm"
                  onClick={() => atualizarStatus(p.id_pedido, "Entregue")}
                >
                  Marcar como Entregue
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => atualizarStatus(p.id_pedido, "Cancelado")}
                >
                  Cancelar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
