const {
  criarTipoSinal,
  listarTiposSinais,
  buscarTipoSinalPorId,
  atualizarTipoSinalPorId,
  deletarTipoSinalPorId,
} = require("../services/tipoSinalService");

const criar = async (req, res) => {
  try {
    const { nome, unidade_medida } = req.body;

    if (!nome || !unidade_medida) {
      return res.status(400).json({ error: "Campos obrigatórios" });
    }

    const tipoSinal = await criarTipoSinal(nome, unidade_medida);

    return res.status(201).json(tipoSinal);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar tipo sinal" });
  }
};

const listar = async (req, res) => {
  try {
    const data = await listarTiposSinais();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Erro ao listar os tipos de sinais" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await buscarTipoSinalPorId(id);

    if (!data) {
      return res.status(404).json({ error: "Não encontrado" });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar tipo de sinal pelo ID" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, unidade_medida } = req.body;

    const data = await atualizarTipoSinalPorId(id, nome, unidade_medida);

    if (!data) {
      return res.status(404).json({ error: "Não encontrado" });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar o tipo de sinal" });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const tipoSinal = await deletarTipoSinalPorId(id);

    if (!tipoSinal) {
      return res.status(404).json({ error: "Não encontrado" });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Erro ao deletar o tipo sinal" });
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
};