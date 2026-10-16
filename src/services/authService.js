const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Cuidador } = require("../models");

const VALIDADE_TOKEN_RESET = "30m";

const segredoDoReset = (cuidador) =>
  `${process.env.JWT_SECRET}:reset-senha:${cuidador.senha}`;

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

const solicitarRedefinicaoSenha = async (email) => {
  const cuidador = await Cuidador.findOne({ where: { email } });

  if (!cuidador) return null;

  const resetToken = jwt.sign(
    { id_cuidador: cuidador.id_cuidador, tipo: "reset_senha" },
    segredoDoReset(cuidador),
    { expiresIn: VALIDADE_TOKEN_RESET },
  );

  return { resetToken, cuidador };
};

// Devolve o cuidador dono do token, ou null se o token for inválido,
// estiver expirado ou já tiver sido usado.
const buscarCuidadorPorResetToken = async (resetToken) => {
  if (typeof resetToken !== "string" || !resetToken) return null;

  // decode (sem verificar) só para descobrir de quem é o token;
  // a verificação de verdade da assinatura acontece logo abaixo.
  const conteudo = jwt.decode(resetToken);
  if (!conteudo || conteudo.tipo !== "reset_senha" || !conteudo.id_cuidador) return null;

  const cuidador = await Cuidador.findByPk(conteudo.id_cuidador);
  if (!cuidador) return null;

  try {
    jwt.verify(resetToken, segredoDoReset(cuidador), { algorithms: ["HS256"] });
  } catch (error) {
    return null;
  }

  return cuidador;
};

const redefinirSenha = async (resetToken, novaSenha) => {
  const cuidador = await buscarCuidadorPorResetToken(resetToken);
  if (!cuidador) return false;

  const novoHash = await bcrypt.hash(novaSenha, 10);

  // Atualiza só se a senha ainda for a mesma de quando o token foi validado.
  // Se dois pedidos com o mesmo token chegarem juntos, apenas um consegue.
  const [alterados] = await Cuidador.update(
    { senha: novoHash },
    { where: { id_cuidador: cuidador.id_cuidador, senha: cuidador.senha } },
  );

  return alterados === 1;
};

module.exports = {
  login,
  solicitarRedefinicaoSenha,
  buscarCuidadorPorResetToken,
  redefinirSenha,
};