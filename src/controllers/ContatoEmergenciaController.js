const {
  criarContatoEmergencia,
  listarContatosEmergencia,
  buscarContatoEmergenciaPorId,
  atualizarContatoEmergenciaPorId,
  deletarContatoEmergenciaPorId,
} = require("../services/contatoEmergenciaService");

const criar = async (req, res) => {
  try {
    const { nome, telefone, parentesco, id_monitorado } = req.body;

    if (!nome || !telefone || !parentesco || !id_monitorado) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    const contato = await criarContatoEmergencia(
      id_monitorado,
      nome,
      telefone,
      parentesco,
    );

    return res.status(201).json(contato);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao criar contato de emergência",
    });
  }
};

const listar = async (req, res) => {
  try {
    const contatos = await listarContatosEmergencia();
    return res.status(200).json(contatos);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar contatos de emergência",
    });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const contato = await buscarContatoEmergenciaPorId(id);

    if (!contato) {
      return res.status(404).json({
        error: "Contato de emergência não encontrado",
      });
    }

    return res.status(200).json(contato);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar contato de emergência",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, parentesco } = req.body;

    const contato = await atualizarContatoEmergenciaPorId(
      id,
      nome,
      telefone,
      parentesco,
    );

    if (!contato) {
      return res.status(404).json({
        error: "Contato de emergência não encontrado",
      });
    }

    return res.status(200).json(contato);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar contato de emergência",
    });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await deletarContatoEmergenciaPorId(id);

    if (!resultado) {
      return res.status(404).json({
        error: "Contato de emergência não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao deletar contato de emergência",
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
