const {
  criarLimiteSinal,
  listarLimitesSinais,
  buscarLimiteSinalPorId,
  buscarLimiteSinalPorMonitorado,
  atualizarLimiteSinalPorId,
  deletarLimiteSinalPorId,
} = require("../services/LimiteSinalService");

const criar = async (req, res) => {
  try {
    const { id_monitorado, id_tipo_sinal, valor_min, valor_max } = req.body;

    if (!id_monitorado || !id_tipo_sinal || !valor_min || !valor_max) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios!",
      });
    }

    const limiteSinal = await criarLimiteSinal(
      id_monitorado,
      id_tipo_sinal,
      valor_min,
      valor_max,
    );

    return res.status(201).json(limiteSinal);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar o limite de sinal",
    });
  }
};

const listar = async (req, res) => {
  try {
    const limitesSinais = await listarLimitesSinais();

    return res.status(200).json(limitesSinais);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar os limites de sinal",
    });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const limiteSinal = await buscarLimiteSinalPorId(id);

    if (!limiteSinal) {
      return res.status(404).json({
        error: "Limite Sinal não encontrado",
      });
    }

    return res.status(200).json(limiteSinal);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar o limite de sinal por ID",
    });
  }
};

const buscarPorMonitorado = async (req, res) => {
  try {
    const { id_limite_sinal, id_monitorado } = req.params;

    const limiteSinal = await buscarLimiteSinalPorMonitorado(
      id_limite_sinal,
      id_monitorado,
    );

    if (!limiteSinal) {
      return res.status(404).json({
        error: "Limite Sinal não encontrado",
      });
    }

    return res.status(200).json(limiteSinal);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar o limite de sinal por monitorado",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_min, valor_max } = req.body;

    const limiteSinal = await atualizarLimiteSinalPorId(
      id,
      undefined,
      undefined,
      valor_min,
      valor_max,
    );

    if (!limiteSinal) {
      return res.status(404).json({
        error: "Limite Sinal não encontrado",
      });
    }

    return res.status(200).json(limiteSinal);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar o limite de sinal",
    });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const limiteSinal = await deletarLimiteSinalPorId(id);

    if (!limiteSinal) {
      return res.status(404).json({
        error: "Limite Sinal não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao deletar o limite de sinal",
    });
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  buscarPorMonitorado,
  atualizar,
  deletar,
};
