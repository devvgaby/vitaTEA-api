const {
  criarDispositivo,
  listarDispositivos,
  buscarDispositivoPorMonitorado,
  buscarDispositivoPorId,
  atualizarDispositivoPorId,
  deletarDispositivoPorId,
} = require("../services/dispositivoService");

const criar = async (req, res) => {
  const { codigo, id_monitorado } = req.body;

  if (!codigo || !id_monitorado) {
    return res.status(400).json({
      error: "Código e ID do monitorado são obrigatórios",
    });
  }

  const dispositivo = await criarDispositivo(
    codigo,
    id_monitorado
  );

  return res.status(201).json(dispositivo);
};

const listar = async (req, res) => {
  const dispositivos = await listarDispositivos();

  return res.json(dispositivos);
};

const buscarPorId = async (req, res) => {
  const { id } = req.params;

  const dispositivo = await buscarDispositivoPorId(id);

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

  return res.json(dispositivo);
};

const buscarPorMonitorado = async (req, res) => {
  const { id_dispositivo, id_monitorado } = req.params;

  const dispositivo = await buscarDispositivoPorMonitorado(
    id_dispositivo,
    id_monitorado
  );

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

  const dispositivo = await atualizarDispositivoPorId(
    id,
    codigo,
    id_monitorado
  );

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

  return res.json(dispositivo);
};

const deletar = async (req, res) => {
  const { id } = req.params;

  const dispositivo =
    await deletarDispositivoPorId(id);

  if (!dispositivo) {
    return res.status(404).json({
      error: "Dispositivo não encontrado",
    });
  }

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