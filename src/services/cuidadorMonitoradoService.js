const { CuidadorMonitorado } = require("../models");

const criarCuidadorMonitorado = async (id_cuidador, id_monitorado) => {
  const existente = await CuidadorMonitorado.findOne({
    where: { id_cuidador, id_monitorado },
    paranoid: false,
  });

  if (existente) {
    if (existente.deletedAt) await existente.restore();
    return { id_cuidador, id_monitorado };
  }

  await CuidadorMonitorado.create({ id_cuidador, id_monitorado });

  return { id_cuidador, id_monitorado };
};

const listarCuidadoresMonitorados = async (idsMonitorados) => {
  return await CuidadorMonitorado.findAll({ where: { id_monitorado: idsMonitorados } });
};

const buscarCuidadorMonitoradoPorId = async (id_cuidador, id_monitorado) => {
  return await CuidadorMonitorado.findOne({
    where: { id_cuidador, id_monitorado },
  });
};

const deletarCuidadorMonitoradoPorId = async (id_cuidador, id_monitorado) => {
  const cuidadorMonitorado = await CuidadorMonitorado.findOne({
    where: { id_cuidador, id_monitorado },
  });

  if (!cuidadorMonitorado) return null;

  await cuidadorMonitorado.destroy();
  return true;
};

module.exports = {
  criarCuidadorMonitorado,
  listarCuidadoresMonitorados,
  buscarCuidadorMonitoradoPorId,
  deletarCuidadorMonitoradoPorId,
};
