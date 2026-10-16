const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Cuidador } = require("../models");

const VALIDADE_TOKEN_RESET = "30m";

// Código de 6 dígitos enviado por e-mail e digitado no app.
// É derivado (HMAC) do segredo do reset, que inclui o hash da senha atual:
// não precisa ser guardado no banco e deixa de valer assim que a senha muda.
// Vale na janela atual e na anterior (15 a 30 minutos).
const JANELA_CODIGO_MS = 15 * 60 * 1000;
const MAX_TENTATIVAS_CODIGO = 5;
const tentativasCodigo = new Map(); // id_cuidador -> { falhas, expiraEm }

const segredoDoReset = (cuidador) =>
  `${process.env.JWT_SECRET}:reset-senha:${cuidador.senha}`;

const gerarCodigo = (cuidador, janela) => {
  const hmac = crypto
    .createHmac("sha256", segredoDoReset(cuidador))
    .update(`codigo:${cuidador.id_cuidador}:${janela}`)
    .digest();
  return String(hmac.readUInt32BE(0) % 1000000).padStart(6, "0");
};

const janelaAtual = () => Math.floor(Date.now() / JANELA_CODIGO_MS);

const codigoConfere = (cuidador, codigo) => {
  const agora = janelaAtual();
  return [agora, agora - 1].some((janela) =>
    crypto.timingSafeEqual(Buffer.from(gerarCodigo(cuidador, janela)), Buffer.from(codigo)),
  );
};

const bloqueadoPorTentativas = (id) => {
  const registro = tentativasCodigo.get(id);
  if (!registro) return false;
  if (registro.expiraEm < Date.now()) {
    tentativasCodigo.delete(id);
    return false;
  }
  return registro.falhas >= MAX_TENTATIVAS_CODIGO;
};

const registrarFalha = (id) => {
  const registro = tentativasCodigo.get(id);
  if (registro && registro.expiraEm >= Date.now()) {
    registro.falhas += 1;
  } else {
    tentativasCodigo.set(id, { falhas: 1, expiraEm: Date.now() + JANELA_CODIGO_MS });
  }
};

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

  // Não zera as tentativas aqui: o código é o mesmo dentro da janela, então
  // pedir de novo não pode liberar mais chutes.
  const codigo = gerarCodigo(cuidador, janelaAtual());

  return { resetToken, codigo, cuidador };
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

// Redefinição pelo app: e-mail + código de 6 dígitos.
// Devolve "ok", "invalido" ou "bloqueado" (tentativas demais).
const redefinirSenhaComCodigo = async (email, codigo, novaSenha) => {
  if (typeof codigo !== "string" || !/^\d{6}$/.test(codigo)) return "invalido";

  const cuidador = await Cuidador.findOne({ where: { email } });
  if (!cuidador) return "invalido";

  if (bloqueadoPorTentativas(cuidador.id_cuidador)) return "bloqueado";

  if (!codigoConfere(cuidador, codigo)) {
    registrarFalha(cuidador.id_cuidador);
    return "invalido";
  }

  const novoHash = await bcrypt.hash(novaSenha, 10);
  const [alterados] = await Cuidador.update(
    { senha: novoHash },
    { where: { id_cuidador: cuidador.id_cuidador, senha: cuidador.senha } },
  );
  if (alterados !== 1) return "invalido";

  tentativasCodigo.delete(cuidador.id_cuidador);
  return "ok";
};

module.exports = {
  login,
  solicitarRedefinicaoSenha,
  buscarCuidadorPorResetToken,
  redefinirSenha,
  redefinirSenhaComCodigo,
};