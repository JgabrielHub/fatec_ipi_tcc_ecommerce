import React, { useState } from 'react';
import axios from 'axios';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleRecuperar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/usuarios/recuperar-senha', {
        email_usuario: email,
        nova_senha: novaSenha,
      });
      setMensagem("✅ " + (res.data.message || "Senha atualizada com sucesso!"));
    } catch (err) {
      console.error('Erro ao recuperar senha:', err.response?.data || err.message);
      setMensagem("❌ " + (err.response?.data?.error || 'Erro ao tentar recuperar senha.'));
    }
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-header text-center">
              <h2>Recuperar senha</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleRecuperar}>
                {/* Campo de Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="novaSenha" className="form-label">Nova Senha:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="novaSenha"
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                </div>

                {mensagem && (
                  <div className={`alert ${mensagem.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {mensagem}
                  </div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Atualizar Senha
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <a href="/cadastro" className="card-link">Não possuo cadastro</a>
              <a href="/login" className="card-link">Tentar entrar novamente</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}