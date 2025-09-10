import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/usuarios/login", {
        email_usuario: email,
        senha_usuario: senha,
      });
      setMensagem("✅ Login bem-sucedido!");
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);
      setMensagem("❌ " + (err.response?.data?.error || "Falha no login."));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%" }}>Entrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
