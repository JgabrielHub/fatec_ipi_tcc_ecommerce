import React, { useState } from "react";
import axios from "axios";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/usuarios", {
        nome_usuario: nome,
        email_usuario: email,
        senha_usuario: senha,
        cpf_usuario: cpf,
        endereco_usuario: endereco
      });
      setMensagem("✅ Cadastro realizado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setCpf("");
      setEndereco("");  
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
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
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%" }}>Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
