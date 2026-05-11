const {
  criarCuidador,
  listarCuidadores,
  buscarCuidadorPorId,
  atualizarCuidadorPorId,
  deletarCuidadorPorId,
} = require("../services/cuidadorService");

const criar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    const cuidador = await criarCuidador(nome, email, senha);

    return res.status(201).json(cuidador);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar cuidador",
    });
  }
};

const listar = async (req, res) => {
  try {
    const cuidadores = await listarCuidadores();
    return res.status(200).json(cuidadores);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar cuidadores",
    });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cuidador = await buscarCuidadorPorId(id);

    if (!cuidador) {
      return res.status(404).json({
        error: "Nenhum cuidador encontrado!",
      });
    }

    return res.status(200).json(cuidador);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar cuidador",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const cuidador = await atualizarCuidadorPorId(id, nome, email, senha);

    if (!cuidador) {
      return res.status(404).json({
        error: "Nenhum cuidador encontrado!",
      });
    }

    return res.status(200).json(cuidador);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar cuidador",
    });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await deletarCuidadorPorId(id);

    if (!resultado) {
      return res.status(404).json({
        error: "Nenhum cuidador encontrado!",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao deletar cuidador",
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
