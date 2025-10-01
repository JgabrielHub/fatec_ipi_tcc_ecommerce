const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // formato "Bearer token"

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "seu_segredo_jwt");
    req.userId = decoded.id; // ID do usuário no token
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

module.exports = authMiddleware;
