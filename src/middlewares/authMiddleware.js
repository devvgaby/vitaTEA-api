const jwt = require("jsonwebtoken");

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não informado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.cuidador = { id_cuidador: payload.id_cuidador, email: payload.email };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

module.exports = { autenticar };
