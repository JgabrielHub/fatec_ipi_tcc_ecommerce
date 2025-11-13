import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function EditarPerfil() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    nome_usuario: "",
    email_usuario: "",
    senha_usuario: "",
    confirmarSenha: "",
    cpf_usuario: "",
    endereco_usuario: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  // 🔹 Preenche os dados do usuário logado
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nome_usuario: user.nome_usuario || "",
        email_usuario: user.email_usuario || "",
        cpf_usuario: user.cpf_usuario || "",
        endereco_usuario: user.endereco_usuario || "",
      }));
    }
  }, [user]);

  // 🔹 Atualiza o form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Envia as alterações
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id_usuario) {
      setMessage("Usuário não está definido. Faça login novamente.");
      setMessageType("error");
      return;
    }

    if (formData.senha_usuario && formData.senha_usuario !== formData.confirmarSenha) {
      setMessage("❌ As senhas não coincidem.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = { ...formData };
      delete dataToSend.confirmarSenha; // não precisa enviar

      if (!formData.senha_usuario) {
        delete dataToSend.senha_usuario;
      }

      // 🔹 Inclui o token JWT no cabeçalho
      const response = await fetch(`http://localhost:5000/usuarios/${user.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // <- necessário
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar perfil");
      }

      const updatedUser = await response.json();

      setMessage("✅ Perfil atualizado com sucesso!");
      setMessageType("success");

      // Atualiza o contexto do usuário
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));
    } catch (error) {
      console.error("Erro:", error);
      setMessage(error.message || "Erro ao atualizar perfil");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center bg-primary text-white">
              <h2 className="card-title">Editar Perfil</h2>
            </div>
            <div className="card-body">
              {message && (
                <div
                  className={`alert ${
                    messageType === "success" ? "alert-success" : "alert-danger"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mb-3">
                  <label className="form-label">Nome:</label>
                  <input
                    type="text"
                    name="nome_usuario"
                    value={formData.nome_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />

                  <label className="form-label mt-3">CPF:</label>
                  <input
                    type="text"
                    name="cpf_usuario"
                    value={formData.cpf_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />

                  <label className="form-label mt-3">E-mail:</label>
                  <input
                    type="email"
                    name="email_usuario"
                    value={formData.email_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />

                  <label className="form-label mt-3">Nova Senha:</label>
                  <input
                    type="password"
                    name="senha_usuario"
                    value={formData.senha_usuario}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Digite a nova senha (opcional)"
                  />

                  <label className="form-label mt-3">Confirmar Senha:</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Confirme a nova senha"
                  />

                  <label className="form-label mt-3">Endereço:</label>
                  <input
                    type="text"
                    name="endereco_usuario"
                    value={formData.endereco_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />

                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
