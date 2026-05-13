const { Dispositivo } = require("../models");

const criarDispositivo = async (codigo, id_monitorado) => {
  const dispositivo = await Dispositivo.create({
    codigo,
    id_monitorado,
  });

  return {
    id_dispositivo: dispositivo.id_dispositivo,
    codigo: dispositivo.codigo,
    id_monitorado: dispositivo.id_monitorado,
  };
};

const listarDispositivos = async () => {
  return await Dispositivo.findAll();
};

const buscarDispositivoPorMonitorado = async (
  id_dispositivo,
  id_monitorado,
) => {
  return await Dispositivo.findOne({
    where: {
      id_dispositivo,
      id_monitorado,
    },
  });
};

const buscarDispositivoPorId = async (id_dispositivo) => {
  return await Dispositivo.findByPk(id_dispositivo);
};

const atualizarDispositivoPorId = async (
  id_dispositivo,
  codigo,
  id_monitorado,
) => {
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

  await dispositivo.destroy();

  return true;
};

module.exports = {
  criarDispositivo,
  listarDispositivos,
  buscarDispositivoPorMonitorado,
  buscarDispositivoPorId,
  atualizarDispositivoPorId,
  deletarDispositivoPorId,
};
