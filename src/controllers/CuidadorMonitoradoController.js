const { CuidadorMonitorado } = require("../models");

const criar = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.body;

    if (!id_cuidador || !id_monitorado) {
      return res.status(400).json({
        error: "id_cuidador e id_monitorado são obrigatórios",
      });
    }

    const cuidadorMonitorado = await CuidadorMonitorado.create({
      id_cuidador,
      id_monitorado,
    });

    return res.status(201).json(cuidadorMonitorado);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar relacionamento",
    });
  }
};

const listar = async (req, res) => {
  try {
    const cuidadoresMonitorados = await CuidadorMonitorado.findAll();
    return res.status(200).json(cuidadoresMonitorados);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar relacionamentos",
    });
  }
};

const remover = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.body;

    if (!id_cuidador || !id_monitorado) {
      return res.status(400).json({
        error: "id_cuidador e id_monitorado são obrigatórios",
      });
    }

    const deleted = await CuidadorMonitorado.destroy({
      where: { id_cuidador, id_monitorado },
    });

    if (!deleted) {
      return res.status(404).json({
        error: "Relacionamento não encontrado",
      });
    }

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao remover relacionamento",
    });
  }
};

module.exports = {
  criar,
  listar,
  remover,
};