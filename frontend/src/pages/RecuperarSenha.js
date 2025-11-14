import { useState } from 'react';
import axios from 'axios';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setLoading(true);
    if (novaSenha !== confirmarSenha) {
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/usuarios/recuperar-senha', {
        email_usuario: email,
        nova_senha: novaSenha,
      });
      setMensagem("✅ " + (res.data.message || "Senha atualizada com sucesso!"));
      setEmail('');
      setNovaSenha('');
    } catch (err) {
      setMensagem("❌ " + (err.response?.data?.error || 'Erro ao tentar recuperar senha.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5 shadow">
            <div className="card-header text-center">
              <h2 className="card-title">Recuperar senha</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleRecuperar} autoComplete="off">
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmarSenha" className="form-label">Confirmar Nova Senha:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmarSenha"
                    placeholder="Confirme sua nova senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {mensagem && (
                  <div className={`alert ${mensagem.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {mensagem}
                  </div>
                )}
                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Atualizando...' : 'Atualizar Senha'}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <a href="/cadastro" className="card-link">Não possuo cadastro</a>
              <a href="/login" className="card-link ms-3">Tentar entrar novamente</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}