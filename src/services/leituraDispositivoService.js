const { Op } = require("sequelize");
const { LeituraDispositivo, Dispositivo } = require("../models");
const { avaliarLeitura } = require("./alertaService");

const criarLeituraDispositivo = async (id_dispositivo, id_tipo_sinal, valor, data_hora) => {
  const leitura = await LeituraDispositivo.create({
    id_dispositivo,
    id_tipo_sinal,
    valor,
    data_hora,
  });

  await Dispositivo.update(
    { ultima_conexao: leitura.data_hora },
    { where: { id_dispositivo } },
  );

  const alerta = await avaliarLeitura(leitura);

  return { leitura, alerta };
};

const listarLeiturasDispositivos = async (idsMonitorados) => {
  const dispositivos = await Dispositivo.findAll({
    where: { id_monitorado: idsMonitorados },
    attributes: ["id_dispositivo"],
    paranoid: false,
  });

  return await LeituraDispositivo.findAll({
    where: { id_dispositivo: dispositivos.map((d) => d.id_dispositivo) },
    order: [["data_hora", "DESC"]],
  });
};

const buscarLeituraDispositivoPorId = async (id_leitura_dispositivo) => {
  return await LeituraDispositivo.findByPk(id_leitura_dispositivo);
};

const buscarLeiturasDispositivoPorDispositivo = async (id_dispositivo, { desde, limite } = {}) => {
  const where = { id_dispositivo };

  if (desde) {
    where.data_hora = { [Op.gte]: new Date(desde) };
  }

  return await LeituraDispositivo.findAll({
    where,
    order: [["data_hora", "DESC"]],
    ...(limite ? { limit: Number(limite) } : {}),
  });
};

const atualizarLeituraDispositivoPorId = async (id_leitura_dispositivo, dados) => {
  const leitura = await LeituraDispositivo.findByPk(id_leitura_dispositivo);
  if (!leitura) return null;

  await leitura.update(dados);
  return leitura;
};

const deletarLeituraDispositivoPorId = async (id_leitura_dispositivo) => {
  const leitura = await LeituraDispositivo.findByPk(id_leitura_dispositivo);
  if (!leitura) return null;

  await leitura.destroy();
  return true;
};

module.exports = {
  criarLeituraDispositivo,
  listarLeiturasDispositivos,
  buscarLeituraDispositivoPorId,
  buscarLeiturasDispositivoPorDispositivo,
  atualizarLeituraDispositivoPorId,
  deletarLeituraDispositivoPorId,
};
