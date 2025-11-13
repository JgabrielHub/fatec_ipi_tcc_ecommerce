import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser({
        ...JSON.parse(storedUser),
        token: storedToken
      });
    }
  }, []);

  const login = (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario));

    setUser({
      ...usuario,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 Adicionamos uma função auxiliar para chamadas autenticadas
  const authFetch = async (url, options = {}) => {
    if (!user?.token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const headers = {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      logout(); // Token expirado ou inválido → deslogar automaticamente
    }
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authFetch, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
