const { Dispositivo } = require("../models");

const criar = async (req, res) => {
  const { codigo, id_monitorado } = req.body;

  if (!codigo || !id_monitorado) {
    return res.status(400).json({
      error: "Código e ID do monitorado são obrigatórios",
    });
  }

  const dispositivo = await Dispositivo.create({
    codigo,
    id_monitorado,
  });

  return res.status(201).json(dispositivo);
};

const listar = async (req, res) => {
  const dispositivos = await Dispositivo.findAll();

  return res.json(dispositivos);
};

const buscarPorId = async (req, res) => {
  const { id } = req.params;

  const dispositivo = await Dispositivo.findByPk(id);

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

  return res.json(dispositivo);
};

const buscarPorMonitorado = async (req, res) => {
  const { id_dispositivo, id_monitorado } = req.params;

  const dispositivo = await Dispositivo.findOne({
    where: {
      id_dispositivo,
      id_monitorado,
    },
  });

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

  return res.json(dispositivo);
};

const atualizar = async (req, res) => {
  const { id } = req.params;
  const { codigo, id_monitorado } = req.body;

  const dispositivo = await Dispositivo.findByPk(id);

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

  if (codigo !== undefined) {
    dispositivo.codigo = codigo;
  }

  if (id_monitorado !== undefined) {
    dispositivo.id_monitorado = id_monitorado;
  }

  await dispositivo.save();

  return res.json(dispositivo);
};

const deletar = async (req, res) => {
  const { id } = req.params;

  const dispositivo = await Dispositivo.findByPk(id);

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

  await dispositivo.destroy();

  return res.status(204).send();
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  buscarPorMonitorado,
  atualizar,
  deletar,
};