const nodemailer = require("nodemailer");

const smtpConfigurado = () => Boolean(process.env.SMTP_HOST);

let transporte = null;
let chaveDoTransporte = null;

const obterTransporte = () => {
  const chave = smtpConfigurado()
    ? [process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER].join("|")
    : "simulado";

  if (transporte && chave === chaveDoTransporte) return transporte;

  if (smtpConfigurado()) {
    const porta = Number(process.env.SMTP_PORT || 587);
    transporte = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: porta,
      secure: process.env.SMTP_SECURE === "true" || porta === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      // Sem isso, uma porta bloqueada deixa o pedido "pendurado" por 2 minutos
      // e o app acaba mostrando erro de tempo esgotado.
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  } else {
    transporte = nodemailer.createTransport({ jsonTransport: true });
  }

  chaveDoTransporte = chave;
  return transporte;
};

const enviados = [];

const enviarEmail = async ({ para, assunto, texto, html }) => {
  const mensagem = {
    from: process.env.MAIL_FROM || "VitaTEA <nao-responda@vitatea.local>",
    to: para,
    subject: assunto,
    text: texto,
    html,
  };

  await obterTransporte().sendMail(mensagem);

  const simulado = !smtpConfigurado();
  enviados.push({ para, assunto, texto, simulado, em: new Date() });
  if (enviados.length > 50) enviados.shift();

  if (simulado && process.env.NODE_ENV !== "test") {
    console.log(`[e-mail simulado] Para: ${para} | Assunto: ${assunto}\n${texto}\n`);
  }

  return { simulado };
};

// Confere host, porta, usuário e senha do SMTP sem enviar nada.
// Lança erro se algo estiver errado (usado pelo script scripts/testar-email.js).
const verificarSmtp = async () => {
  if (!smtpConfigurado()) throw new Error("SMTP_HOST não está definido no .env");
  await obterTransporte().verify();
};

// Traduz os erros mais comuns do SMTP para uma explicação simples.
const explicarErroSmtp = (erro) => {
  const codigo = erro && erro.code;
  const resposta = erro && erro.responseCode;

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
      "algumas redes (faculdade, empresa) bloqueiam a porta 587. Tente outra rede, ou a porta 465 " +
      "com SMTP_SECURE=true."
    );
  }
  if (codigo === "EENVELOPE") {
    return "O endereço de destino ou o remetente (MAIL_FROM) é inválido.";
  }
  return "";
};

const escaparHtml = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const urlDoApp = () => (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

let avisouUrlLocal = false;

// O link do e-mail abre uma página servida pelo próprio backend
// (GET /auth/redefinir-senha). Por isso APP_URL deve ser o endereço da API
// que o CELULAR consegue acessar (nunca localhost).
const montarLinkRedefinicao = (resetToken) => {
  const base = urlDoApp();

  if (!avisouUrlLocal && /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(base)) {
    avisouUrlLocal = true;
    console.warn(
      `[aviso] APP_URL=${base} só funciona no próprio computador. ` +
        "Para abrir o link no celular, use o IP do computador na rede (ex.: http://192.168.0.10:3000) " +
        "ou um endereço público.",
    );
  }

  return `${base}/auth/redefinir-senha?token=${encodeURIComponent(resetToken)}`;
};

const enviarEmailRedefinicaoSenha = async ({ para, nome, resetToken }) => {
  const link = montarLinkRedefinicao(resetToken);

  const texto = [
    `Olá, ${nome}!`,
    "",
    "Recebemos um pedido para redefinir a senha da sua conta no VitaTEA.",
    "Para criar uma nova senha, abra o link abaixo (válido por 30 minutos e de uso único):",
    link,
    "",
    "Se preferir, abra a tela de recuperação no aplicativo e cole este código:",
    resetToken,
    "",
    "Se você não fez esse pedido, ignore esta mensagem: sua senha continua a mesma.",
  ].join("\n");

  const html = `
    <p>Olá, ${escaparHtml(nome)}!</p>
    <p>Recebemos um pedido para redefinir a senha da sua conta no VitaTEA.</p>
    <p><a href="${escaparHtml(link)}">Criar uma nova senha</a> (o link vale por 30 minutos e só pode ser usado uma vez).</p>
    <p>Se preferir, abra a tela de recuperação no aplicativo e cole este código:<br><code>${escaparHtml(resetToken)}</code></p>
    <p>Se você não fez esse pedido, ignore esta mensagem: sua senha continua a mesma.</p>`;

  return enviarEmail({ para, assunto: "VitaTEA - redefinição de senha", texto, html });
};

module.exports = {
  smtpConfigurado,
  enviarEmail,
  enviarEmailRedefinicaoSenha,
  verificarSmtp,
  explicarErroSmtp,
  enviados,
};