import React, { useState } from "react";
import axios from "axios";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/usuarios", {
        nome_usuario: nome,
        email_usuario: email,
        senha_usuario: senha,
        confirmarSenha: confirmarSenha,
        cpf_usuario: cpf,
        endereco_usuario: endereco,
      });
      setMensagem("✅ Cadastro realizado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setCpf("");
      setEndereco("");
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5 shadow">
            <div className="card-header text-center">
              <h2 className="card-title">Cadastro</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleCadastro}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Nome:
                  </label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="email" className="form-label">
                    Senha:
                  </label>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="email" className="form-label">
                    Confirmar senha:
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="email" className="form-label">
                    CPF:
                  </label>
                  <input
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                    className="form-control"
                  />
                  <label htmlFor="email" className="form-label">
                    Endereço:
                  </label>
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                    className="form-control"
                  />
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary">
                      Cadastrar
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-center">
              {mensagem && <p>{mensagem}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
