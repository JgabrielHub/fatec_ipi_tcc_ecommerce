module.exports = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (req.user.tipo_usuario !== "admin") {
    return res.status(403).json({ error: "Acesso proibido. Apenas administradores." });
  }

  next();
};
