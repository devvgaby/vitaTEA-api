const nodemailer = require("nodemailer");

// Envio REAL por SMTP. Não existe mais modo "simulado": sem SMTP configurado,
// o envio falha com um erro explícito (e a API nunca devolve o token).

const smtpConfigurado = () => Boolean(process.env.SMTP_HOST);

class SmtpNaoConfiguradoError extends Error {
  constructor() {
    super("SMTP_HOST não está definido no ambiente deste servidor");
    this.name = "SmtpNaoConfiguradoError";
    this.code = "SMTP_NAO_CONFIGURADO";
  }
}

class UrlPublicaInvalidaError extends Error {
  constructor(motivo) {
    super(motivo);
    this.name = "UrlPublicaInvalidaError";
    this.code = "URL_PUBLICA_INVALIDA";
  }
}

let transporte = null;
let chaveDoTransporte = null;

const obterTransporte = () => {
  if (!smtpConfigurado()) throw new SmtpNaoConfiguradoError();

  const chave = [
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_USER,
    process.env.SMTP_SECURE,
  ].join("|");

  if (transporte && chave === chaveDoTransporte) return transporte;

  const porta = Number(process.env.SMTP_PORT || 587);
  transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: porta,
    secure: process.env.SMTP_SECURE === "true" || porta === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    // Sem isso, uma porta bloqueada deixa o pedido "pendurado" por 2 minutos.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  chaveDoTransporte = chave;
  return transporte;
};

const enviarEmail = async ({ para, assunto, texto, html }) => {
  const transport = obterTransporte();

  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: para,
    subject: assunto,
    text: texto,
    html,
  });

  return { simulado: false };
};

// Confere host, porta, usuário e senha do SMTP sem enviar nada.
const verificarSmtp = async () => {
  await obterTransporte().verify();
};

// Traduz os erros mais comuns do SMTP para uma explicação simples (sem expor segredos).
const explicarErroSmtp = (erro) => {
  const codigo = erro && erro.code;
  const resposta = erro && erro.responseCode;

  if (codigo === "SMTP_NAO_CONFIGURADO") {
    return (
      "O processo do servidor não enxergou SMTP_HOST. O arquivo .env não vai para o Git: " +
      "defina SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e MAIL_FROM nas variáveis de ambiente " +
      "do servidor onde a API roda e reinicie o processo."
    );
  }
  if (codigo === "URL_PUBLICA_INVALIDA") {
    return "Defina API_PUBLIC_URL (ou APP_URL) com o endereço público HTTPS da API e reinicie o servidor.";
  }
  if (codigo === "EAUTH" || resposta === 535 || resposta === 534) {
    return (
      "O servidor recusou o usuário/senha. No Gmail é obrigatório usar uma 'Senha de app' " +
      "(16 letras, gerada em myaccount.google.com/apppasswords, com verificação em duas etapas ativada). " +
      "A senha normal da conta não funciona."
    );
  }
  if (["ETIMEDOUT", "ESOCKET", "ECONNECTION", "EDNS", "ECONNREFUSED"].includes(codigo)) {
    return (
      "Não foi possível conectar ao servidor SMTP. Confira SMTP_HOST e SMTP_PORT, e lembre que " +
      "alguns provedores de hospedagem bloqueiam a porta 587/25. Tente a porta 465 com SMTP_SECURE=true."
    );
  }
  if (codigo === "EENVELOPE") {
    return "O endereço de destino ou o remetente (MAIL_FROM) é inválido.";
  }
  return "";
};

const escaparHtml = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Endereço público do BACKEND, acessível pelo celular (a página de redefinição
// é servida pelo próprio backend em GET /auth/redefinir-senha).
// Prefere API_PUBLIC_URL; APP_URL continua valendo por compatibilidade.
const urlPublicaDoBackend = () => {
  const bruta = (process.env.API_PUBLIC_URL || process.env.APP_URL || "").trim();
  if (!bruta) {
    throw new UrlPublicaInvalidaError("API_PUBLIC_URL/APP_URL não está definido");
  }

  let url;
  try {
    url = new URL(bruta);
  } catch {
    throw new UrlPublicaInvalidaError("API_PUBLIC_URL/APP_URL não é uma URL válida");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new UrlPublicaInvalidaError("API_PUBLIC_URL/APP_URL deve começar com http:// ou https://");
  }

  const local = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/i.test(url.hostname);
  if (local) {
    throw new UrlPublicaInvalidaError(
      "API_PUBLIC_URL/APP_URL aponta para localhost, que o celular do usuário não alcança",
    );
  }

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new UrlPublicaInvalidaError("Em produção, API_PUBLIC_URL/APP_URL deve usar https://");
  }

  return bruta.replace(/\/+$/, "");
};

const montarLinkRedefinicao = (resetToken) =>
  `${urlPublicaDoBackend()}/auth/redefinir-senha?token=${encodeURIComponent(resetToken)}`;

const enviarEmailRedefinicaoSenha = async ({ para, nome, resetToken }) => {
  // Falha antes de tentar enviar se o SMTP ou a URL pública estiverem errados.
  if (!smtpConfigurado()) throw new SmtpNaoConfiguradoError();
  const link = montarLinkRedefinicao(resetToken);

  const texto = [
    `Olá, ${nome}!`,
    "",
    "Recebemos um pedido para redefinir a senha da sua conta no VitaTEA.",
    "Para criar uma nova senha, abra o link abaixo (válido por 30 minutos e de uso único):",
    link,
    "",
    "Se você não fez esse pedido, ignore esta mensagem: sua senha continua a mesma.",
  ].join("\n");

  const html = `
    <p>Olá, ${escaparHtml(nome)}!</p>
    <p>Recebemos um pedido para redefinir a senha da sua conta no VitaTEA.</p>
    <p><a href="${escaparHtml(link)}">Criar uma nova senha</a></p>
    <p>O link vale por 30 minutos e só pode ser usado uma vez.</p>
    <p>Se você não fez esse pedido, ignore esta mensagem: sua senha continua a mesma.</p>`;

  return enviarEmail({ para, assunto: "VitaTEA - redefinição de senha", texto, html });
};

// Usado na inicialização do servidor: diz, sem expor segredos, se o envio vai funcionar.
const diagnosticarEmail = async () => {
  const problemas = [];

  if (!smtpConfigurado()) {
    problemas.push("SMTP_HOST não definido");
  } else {
    try {
      await verificarSmtp();
    } catch (erro) {
      problemas.push(`falha ao conectar no SMTP (${erro.code || erro.name})${explicarErroSmtp(erro) ? ": " + explicarErroSmtp(erro) : ""}`);
    }
  }

  try {
    urlPublicaDoBackend();
  } catch (erro) {
    problemas.push(erro.message);
  }

  return problemas;
};

module.exports = {
  smtpConfigurado,
  enviarEmail,
  enviarEmailRedefinicaoSenha,
  verificarSmtp,
  explicarErroSmtp,
  diagnosticarEmail,
  urlPublicaDoBackend,
};