const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id_usuario: decoded.id_usuario,
      tipo_usuario: decoded.tipo_usuario
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
