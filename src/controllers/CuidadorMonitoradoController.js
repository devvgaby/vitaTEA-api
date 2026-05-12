const {
  criarCuidadorMonitorado,
  listarCuidadoresMonitorados,
  buscarCuidadorMonitoradoPorId,
  deletarCuidadorMonitoradoPorId,
} = require("../services/cuidadorMonitoradoService");

const criar = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.body;

    if (!id_cuidador || !id_monitorado) {
      return res.status(400).json({
        error: "id_cuidador e id_monitorado são obrigatórios",
      });
    }

    const cuidadorMonitorado = await criarCuidadorMonitorado(
      id_cuidador,
      id_monitorado,
    );

    return res.status(201).json(cuidadorMonitorado);
  } catch {
    return res.status(500).json({
      error: "Erro ao criar relacionamento",
    });
  }
};

const listar = async (req, res) => {
  try {
    const cuidadoresMonitorados = await listarCuidadoresMonitorados();
    return res.status(200).json(cuidadoresMonitorados);
  } catch {
    return res.status(500).json({
      error: "Erro ao listar relacionamentos",
    });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.params;

    const cuidadorMonitorado = await buscarCuidadorMonitoradoPorId(
      id_cuidador,
      id_monitorado,
    );

    if (!cuidadorMonitorado) {
      return res.status(404).json({
        error: "Relacionamento não encontrado",
      });
    }

    return res.status(200).json(cuidadorMonitorado);
  } catch {
    return res.status(500).json({
      error: "Erro ao buscar relacionamento",
    });
  }
};

const remover = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.params;

    const deleted = await deletarCuidadorMonitoradoPorId(
      id_cuidador,
      id_monitorado,
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Relacionamento não encontrado",
      });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({
      error: "Erro ao remover relacionamento",
    });
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  remover,
};
