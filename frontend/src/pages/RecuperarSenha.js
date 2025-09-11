import React, { useState } from "react";
import axios from "axios";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleRecuperar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/usuarios/recuperar-senha", {
        email_usuario: email,
        nova_senha: novaSenha,
      });
      setMensagem("✅ " + res.data.message);
    } catch (err) {
      console.error("Erro ao recuperar senha:", err.response?.data || err.message);
      setMensagem("❌ " + (err.response?.data?.error || "Erro ao tentar recuperar senha."));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleRecuperar}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%" }}>Atualizar Senha</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
