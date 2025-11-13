const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda o ID do usuário autenticado no request
    req.user = { id_usuario: decoded.id_usuario };

    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(401).json({ error: "Token inválido" });
  }
};
