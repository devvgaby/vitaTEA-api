
require("dotenv").config();
const nodemailer = require("nodemailer");

describe("Envio de e-mail - VitaTEA", () => {
  test("Deve conectar ao SMTP e enviar um e-mail real", async () => {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_SECURE,
      MAIL_FROM,
    } = process.env;

    expect(SMTP_HOST).toBeTruthy();
    expect(SMTP_USER).toBeTruthy();
    expect(SMTP_PASS).toBeTruthy();

    const porta = Number(SMTP_PORT || 587);

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: porta,
      secure: SMTP_SECURE === "true" || porta === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });

    await transporter.verify();

    const destinatario = process.env.EMAIL_TESTE_DESTINO;
    expect(destinatario).toBeTruthy();

    const resultado = await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: destinatario,
      subject: "Teste de e-mail - VitaTEA",
      text: "Se você recebeu esta mensagem, o envio SMTP real funcionou.",
    });

    expect(resultado.accepted).toContain(destinatario);
  }, 30000);
});
