const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Cuidador } = require("../models");

const login = async (email, senha) => {
  const cuidador = await Cuidador.findOne({ where: { email } });

  if (!cuidador) {
    return null;
  }

  const senhaValida = await bcrypt.compare(senha, cuidador.senha);

  if (!senhaValida) {
    return null;
  }

  const token = jwt.sign(
    { id_cuidador: cuidador.id_cuidador, email: cuidador.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  return {
    token,
    cuidador: {
      id_cuidador: cuidador.id_cuidador,
      nome: cuidador.nome,
      email: cuidador.email,
    },
  };
};

// RF18/RN14 — geração do token de redefinição de senha. Em produção, esse
// token deve ser enviado por e-mail (ex.: via nodemailer) em vez de
// retornado na resposta da API; aqui ele é o próprio retorno para permitir
// testar o fluxo completo sem depender de um provedor de e-mail configurado.
const solicitarRedefinicaoSenha = async (email) => {
  const cuidador = await Cuidador.findOne({ where: { email } });

  // Não revela se o e-mail existe ou não (evita enumeração de usuários).
  if (!cuidador) return null;

  const resetToken = jwt.sign(
    { id_cuidador: cuidador.id_cuidador, tipo: "reset_senha" },
    process.env.JWT_SECRET,
    { expiresIn: "30m" },
  );

  return resetToken;
};

const redefinirSenha = async (resetToken, novaSenha) => {
  let payload;
  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (error) {
    return false;
  }

  if (payload.tipo !== "reset_senha") return false;

  const cuidador = await Cuidador.findByPk(payload.id_cuidador);
  if (!cuidador) return false;

  cuidador.senha = await bcrypt.hash(novaSenha, 10);
  await cuidador.save();
  return true;
};

module.exports = { login, solicitarRedefinicaoSenha, redefinirSenha };
