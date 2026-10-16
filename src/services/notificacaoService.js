const axios = require("axios");
const {
  Cuidador,
  CuidadorMonitorado,
  ContatoEmergencia,
  Monitorado,
} = require("../models");
const { enviarEmail } = require("./emailService");

// Notificação de emergência (RN08/RF12).
//
// Quando uma leitura gera um alerta de nível "alto" ou "crítico":
//  1. os cuidadores vinculados ao monitorado recebem um e-mail;
//  2. nos alertas críticos, os contatos de emergência recebem um SMS:
//     - com o Twilio configurado (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
//       TWILIO_FROM), o SMS é enviado de verdade;
//     - sem o Twilio, com SMS_MODO=terminal, o SMS é apenas IMPRESSO no terminal
//       do servidor (demonstração, nenhuma mensagem real é enviada);
//     - sem nenhum dos dois, essa etapa é ignorada.
// Falhas no envio nunca interrompem o registro da leitura: apenas vão para o log.

const NIVEIS_QUE_NOTIFICAM = ["alto", "critico"];
const NIVEL_SMS = "critico";
const INTERVALO_MS = Number(process.env.NOTIFICACAO_INTERVALO_MS || 5 * 60 * 1000);

const ultimosEnvios = new Map();

const podeEnviar = (chave) => {
  const agora = Date.now();
  const ultimo = ultimosEnvios.get(chave);
  if (ultimo && agora - ultimo < INTERVALO_MS) return false;
  ultimosEnvios.set(chave, agora);
  return true;
};

const limparControleDeEnvios = () => ultimosEnvios.clear();

const twilioConfigurado = () =>
  Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM,
  );

const smsNoTerminal = () => String(process.env.SMS_MODO || "").toLowerCase() === "terminal";

const mascararTelefone = (telefone) => {
  const t = String(telefone);
  return t.length <= 4 ? t : `${t.slice(0, 3)}${"*".repeat(t.length - 7)}${t.slice(-4)}`;
};

// Demonstração: mostra no terminal o SMS que seria enviado. Não envia nada.
const enviarSmsNoTerminal = (contato, telefone, texto) => {
  console.log(
    [
      "",
      "┌─────────────── SMS DE EMERGÊNCIA (simulado no terminal) ───────────────",
      `│ Para: ${contato.nome} (${mascararTelefone(telefone)})`,
      `│ Texto: ${texto}`,
      "└─────────────────────────────────────────────────────────────────────────",
      "",
    ].join("\n"),
  );
};

const normalizarTelefone = (telefone) => {
  const digitos = String(telefone || "").replace(/\D/g, "");
  if (!digitos) return null;
  if (String(telefone).trim().startsWith("+")) return `+${digitos}`;
  if (digitos.startsWith("55") && digitos.length >= 12) return `+${digitos}`;
  return `+55${digitos}`;
};

const enviarSms = async (para, texto) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const corpo = new URLSearchParams({
    To: para,
    From: process.env.TWILIO_FROM,
    Body: texto,
  });

  await axios.post(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, corpo, {
    auth: { username: sid, password: process.env.TWILIO_AUTH_TOKEN },
    timeout: 10000,
  });
};

const rotuloNivel = { alto: "ALTO", critico: "CRÍTICO" };

const notificarAlerta = async ({ alerta, id_monitorado, nomeSinal }) => {
  if (!alerta || !NIVEIS_QUE_NOTIFICAM.includes(alerta.nivel_criticidade)) return;

  const chave = `${id_monitorado}:${nomeSinal}:${alerta.nivel_criticidade}`;
  if (!podeEnviar(chave)) return;

  const monitorado = await Monitorado.findByPk(id_monitorado);
  if (!monitorado) return;

  const nivel = rotuloNivel[alerta.nivel_criticidade];
  const assunto = `VitaTEA - alerta ${nivel}: ${monitorado.nome}`;
  const texto = [
    `Alerta ${nivel} para ${monitorado.nome}.`,
    "",
    alerta.mensagem,
    "",
    "Abra o aplicativo VitaTEA para ver os detalhes e acompanhar os sinais vitais.",
  ].join("\n");

  const vinculos = await CuidadorMonitorado.findAll({ where: { id_monitorado } });
  const cuidadores = await Cuidador.findAll({
    where: { id_cuidador: vinculos.map((v) => v.id_cuidador) },
  });

  await Promise.all(
    cuidadores.map((cuidador) =>
      enviarEmail({ para: cuidador.email, assunto, texto }).catch((erro) =>
        console.error(`Falha ao enviar e-mail de alerta para ${cuidador.email}: ${erro.message}`),
      ),
    ),
  );

  const usaTwilio = twilioConfigurado();
  if (alerta.nivel_criticidade === NIVEL_SMS && (usaTwilio || smsNoTerminal())) {
    const contatos = await ContatoEmergencia.findAll({ where: { id_monitorado } });
    const sms = `VitaTEA: ${monitorado.nome} - alerta ${nivel}. ${alerta.mensagem}`;

    await Promise.all(
      contatos.map(async (contato) => {
        const telefone = normalizarTelefone(contato.telefone);
        if (!telefone) return;
        try {
          if (usaTwilio) await enviarSms(telefone, sms);
          else enviarSmsNoTerminal(contato, telefone, sms);
        } catch (erro) {
          console.error(`Falha ao enviar SMS para ${contato.nome}: ${erro.message}`);
        }
      }),
    );
  }
};

module.exports = {
  notificarAlerta,
  normalizarTelefone,
  limparControleDeEnvios,
  NIVEIS_QUE_NOTIFICAM,
};