const { Dispositivo } = require("../models");

class ConflitoDispositivoError extends Error {}

const sufixoRemovido = (dispositivo) => `${dispositivo.codigo}#removido-${dispositivo.id_dispositivo}`;

const criarDispositivo = async (codigo, id_monitorado) => {
  const [porCodigo, porMonitorado] = await Promise.all([
    Dispositivo.findOne({ where: { codigo }, paranoid: false }),
    Dispositivo.findOne({ where: { id_monitorado }, paranoid: false }),
  ]);

  if (porCodigo && !porCodigo.deletedAt) {
    throw new ConflitoDispositivoError("Este dispositivo já está vinculado a um monitorado");
  }

  if (porMonitorado && !porMonitorado.deletedAt) {
    throw new ConflitoDispositivoError("Este monitorado já possui um dispositivo vinculado");
  }

  if (porCodigo && porCodigo.deletedAt) {
    porCodigo.codigo = sufixoRemovido(porCodigo);
    await porCodigo.save({ paranoid: false });
  }

  let dispositivo;

  if (porMonitorado && porMonitorado.deletedAt) {
    await porMonitorado.restore();
    porMonitorado.codigo = codigo;
    porMonitorado.ultima_conexao = null;
    await porMonitorado.save();
    dispositivo = porMonitorado;
  } else {
    dispositivo = await Dispositivo.create({ codigo, id_monitorado });
  }

  return {
    id_dispositivo: dispositivo.id_dispositivo,
    codigo: dispositivo.codigo,
    id_monitorado: dispositivo.id_monitorado,
  };
};

const listarDispositivos = async (idsMonitorados) => {
  return await Dispositivo.findAll({ where: { id_monitorado: idsMonitorados } });
};

const buscarDispositivoPorMonitorado = async (id_dispositivo, id_monitorado) => {
  return await Dispositivo.findOne({
    where: { id_dispositivo, id_monitorado },
  });
};

const buscarDispositivoPorId = async (id_dispositivo) => {
  return await Dispositivo.findByPk(id_dispositivo);
};

const atualizarDispositivoPorId = async (id_dispositivo, codigo, id_monitorado) => {
  const dispositivo = await Dispositivo.findByPk(id_dispositivo);

  if (!dispositivo) {
    return null;
  }

  if (codigo !== undefined) {
    dispositivo.codigo = codigo;
  }

  if (id_monitorado !== undefined) {
    dispositivo.id_monitorado = id_monitorado;
  }

  await dispositivo.save();

  return dispositivo;
};

const deletarDispositivoPorId = async (id_dispositivo) => {
  const dispositivo = await Dispositivo.findByPk(id_dispositivo);

  if (!dispositivo) {
    return null;
  }

  dispositivo.codigo = sufixoRemovido(dispositivo);
  await dispositivo.save();
  await dispositivo.destroy();

  return true;
};

module.exports = {
  ConflitoDispositivoError,
  criarDispositivo,
  listarDispositivos,
  buscarDispositivoPorMonitorado,
  buscarDispositivoPorId,
  atualizarDispositivoPorId,
  deletarDispositivoPorId,
};
