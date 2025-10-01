import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const res = await axios.post('http://localhost:5000/usuarios/login', {
        email_usuario: email,
        senha_usuario: senha,
      });

      setMensagem('✅ Login bem-sucedido!');
      login(res.data.token); // 🔑 Salva o token no contexto + localStorage

      setTimeout(() => { navigate('/'); }, 1000);
    } catch (err) {
      console.error('Erro no login:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || 'Falha no login. Verifique suas credenciais.';
      setMensagem(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h2>Login</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    id="senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid"> 
                  <button type="submit" className="btn btn-primary">
                    Entrar
                  </button>
                </div>
                
                {mensagem && (
                  <div className={`alert mt-3 ${mensagem.includes('bem-sucedido') ? 'alert-success' : 'alert-danger'}`}>
                    {mensagem}
                  </div>
                )}
              </form>
            </div>
            <div className="card-footer text-center">
              
              <a href="/cadastro">Não tem uma conta? Cadastre-se</a>
              <span className="mx-2">ou</span>
              <a href="/recuperar-senha">Esqueceu sua senha?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}