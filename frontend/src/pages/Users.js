import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/usuarios")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map(u => (
          <li key={u.cpf_usuario}>{u.nome_usuario} - {u.email_usuario}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
