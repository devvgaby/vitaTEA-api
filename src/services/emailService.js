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

const urlDoApp = () => (process.env.APP_URL || "http://localhost:8081").replace(/\/$/, "");

const enviarEmailRedefinicaoSenha = async ({ para, nome, resetToken }) => {
  const link = `${urlDoApp()}/forgot-password?token=${encodeURIComponent(resetToken)}`;

  const texto = [
    `Olá, ${nome}!`,
    "",
    "Recebemos um pedido para redefinir a senha da sua conta no VitaTEA.",
    "Para criar uma nova senha, abra o link abaixo (válido por 30 minutos):",
    link,
    "",
    "Se preferir, abra a tela de recuperação no aplicativo e cole este código:",
    resetToken,
    "",
    "Se você não fez esse pedido, ignore esta mensagem: sua senha continua a mesma.",
  ].join("\n");

  const html = `
    <p>Olá, ${nome}!</p>
    <p>Recebemos um pedido para redefinir a senha da sua conta no VitaTEA.</p>
    <p><a href="${link}">Criar uma nova senha</a> (o link vale por 30 minutos).</p>
    <p>Se preferir, abra a tela de recuperação no aplicativo e cole este código:<br><code>${resetToken}</code></p>
    <p>Se você não fez esse pedido, ignore esta mensagem: sua senha continua a mesma.</p>`;

  return enviarEmail({ para, assunto: "VitaTEA - redefinição de senha", texto, html });
};

module.exports = {
  smtpConfigurado,
  enviarEmail,
  enviarEmailRedefinicaoSenha,
  enviados,
};
