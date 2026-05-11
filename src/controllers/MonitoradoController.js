const {
  criarMonitorado,
  listarMonitorados,
  buscarMonitoradoPorId,
  atualizarMonitoradoPorId,
  deletarMonitoradoPorId,
} = require("../services/monitoradoService");

const criar = async (req, res) => {
  try {
    const { nome, idade, nivel_tea } = req.body;

    if (!nome || !idade || !nivel_tea) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    const monitorado = await criarMonitorado(nome, idade, nivel_tea);

    return res.status(201).json(monitorado);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar monitorado",
    });
  }
};

const listar = async (req, res) => {
  try {
    const monitorados = await listarMonitorados();
    return res.status(200).json(monitorados);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar monitorados",
    });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const monitorado = await buscarMonitoradoPorId(id);
    if (!monitorado) {
      return res.status(404).json({
        error: "Monitorado não encontrado",
      });
    }

    return res.status(200).json(monitorado);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar monitorado",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade, nivel_tea } = req.body;

    const monitorado = await atualizarMonitoradoPorId(
      id,
      nome,
      idade,
      nivel_tea,
    );

    if (!monitorado) {
      return res.status(404).json({
        error: "Monitorado não encontrado",
      });
    }

    return res.status(200).json(monitorado);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar monitorado",
    });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await deletarMonitoradoPorId(id);

    if (!resultado) {
      return res.status(404).json({
        error: "Monitorado não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao deletar monitorado",
    });
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
};
