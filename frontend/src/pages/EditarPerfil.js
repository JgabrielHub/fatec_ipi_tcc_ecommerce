import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function EditarPerfil() {
  const { user, setUser, authFetch } = useAuth(); // ✅ agora usa authFetch para enviar o token

  const [formData, setFormData] = useState({
    nome_usuario: "",
    email_usuario: "",
    senha_usuario: "",
    confirmarSenha: "",
    cpf_usuario: "",
    endereco_usuario: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  // ✅ Preenche o formulário com os dados do usuário logado
  useEffect(() => {
    if (user) {
      setFormData({
        nome_usuario: user.nome_usuario || "",
        email_usuario: user.email_usuario || "",
        senha_usuario: "",
        confirmarSenha: "",
        cpf_usuario: user.cpf_usuario || "",
        endereco_usuario: user.endereco_usuario || ""
      });
    }
  }, [user]);

  // ✅ Atualiza campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Envia atualização com token no header
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
      delete dataToSend.confirmarSenha;
      if (!formData.senha_usuario) delete dataToSend.senha_usuario;

      // ✅ Usa authFetch para incluir automaticamente o Authorization: Bearer token
      const response = await authFetch(`http://localhost:5000/usuarios/${user.id_usuario}`, {
        method: "PUT",
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao atualizar perfil");

      setMessage("Perfil atualizado com sucesso!");
      setMessageType("success");

      // ✅ Atualiza o contexto de usuário com os novos dados
      setUser((prev) => ({
        ...prev,
        ...data.usuario
      }));

    } catch (error) {
      console.error("Erro:", error);
      setMessage(error.message || "Erro ao atualizar perfil");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Layout
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center">
              <h2 className="card-title mb-0">Editar Perfil</h2>
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
                  <label htmlFor="nome_usuario" className="form-label">Nome:</label>
                  <input
                    type="text"
                    name="nome_usuario"
                    value={formData.nome_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cpf_usuario" className="form-label">CPF:</label>
                  <input
                    type="text"
                    name="cpf_usuario"
                    value={formData.cpf_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email_usuario" className="form-label">E-mail:</label>
                  <input
                    type="email"
                    name="email_usuario"
                    value={formData.email_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="senha_usuario" className="form-label">Nova senha:</label>
                  <input
                    type="password"
                    name="senha_usuario"
                    value={formData.senha_usuario}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmarSenha" className="form-label">Confirmar senha:</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="endereco_usuario" className="form-label">Endereço:</label>
                  <input
                    type="text"
                    name="endereco_usuario"
                    value={formData.endereco_usuario}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
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
