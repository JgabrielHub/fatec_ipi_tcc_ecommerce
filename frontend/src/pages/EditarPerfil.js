import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function EditarPerfil() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    nome_usuario: "",
    email_usuario: "",
    senha_usuario: "",
    cpf_usuario: "",
    endereco_usuario: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    if (user) {
      setFormData({
        nome_usuario: user.nome_usuario || "",
        email_usuario: user.email_usuario || "",
        senha_usuario: "",
        cpf_usuario: user.cpf_usuario || "",
        endereco_usuario: user.endereco_usuario || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id_usuario) {
      setMessage("Usuário não está definido. Faça login novamente.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      // Only send senha_usuario if it's filled
      const dataToSend = { ...formData };
      if (!formData.senha_usuario) {
        delete dataToSend.senha_usuario;
      }
      const response = await fetch(`http://localhost:5000/usuarios/${user.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar perfil");
      }
      const updatedUser = await response.json();
      setMessage("Perfil atualizado com sucesso!");
      setMessageType("success");
      // Update user context with returned data
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
          <div className="card">
            <div className="card-header text-center">
              <h2>Editar Perfil</h2>
            </div>
            <div className="card-body">
              {message && (
                <div
                  className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mb-3">
                  <label htmlFor="nome_usuario" className="form-label">
                    Nome:
                  </label>
                <input
                  type="text"
                  name="nome_usuario"
                  placeholder="Nome"
                  value={formData.nome_usuario}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
                <label htmlFor="cpf_usuario" className="form-label">
                  CPF:
                </label>
                <input
                  type="text"
                  name="cpf_usuario"
                  placeholder="CPF"
                  value={formData.cpf_usuario}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
                <label htmlFor="email_usuario" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  name="email_usuario"
                  placeholder="E-mail"
                  value={formData.email_usuario}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
                <label htmlFor="senha_usuario" className="form-label">
                  Senha:
                </label>
                <input
                  type="password"
                  name="senha_usuario"
                  placeholder="Nova Senha"
                  value={formData.senha_usuario}
                  onChange={handleChange}
                  className="form-control"
                />
                <label htmlFor="endereco_usuario" className="form-label">
                  Endereço:
                </label>
                <input
                  type="text"
                  name="endereco_usuario"
                  placeholder="Endereço"
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
