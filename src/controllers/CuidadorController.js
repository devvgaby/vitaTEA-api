const {
  criarCuidador,
  buscarCuidadorPorId,
  atualizarCuidadorPorId,
  deletarCuidadorPorId,
} = require("../services/cuidadorService");

const TAMANHO_MINIMO_SENHA = 6;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailDuplicado = (error) =>
  error?.name === "SequelizeUniqueConstraintError";

const validar = ({ nome, email, senha }, { parcial = false } = {}) => {
  if (!parcial && (!nome || !email || !senha)) {
    return "Todos os campos são obrigatórios";
  }
  if (nome !== undefined && !String(nome).trim()) {
    return "O nome não pode ser vazio";
  }
  if (email !== undefined && !FORMATO_EMAIL.test(String(email))) {
    return "E-mail inválido";
  }
  if (senha !== undefined && String(senha).length < TAMANHO_MINIMO_SENHA) {
    return `A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres`;
  }
  return null;
};

const criar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const erro = validar({ nome, email, senha });
    if (erro) return res.status(400).json({ error: erro });

    const cuidador = await criarCuidador(String(nome).trim(), String(email).trim(), senha);
    return res.status(201).json(cuidador);
  } catch (error) {
    if (emailDuplicado(error)) {
      return res.status(409).json({ error: "Este e-mail já está cadastrado" });
    }
    return res.status(500).json({ error: "Erro ao criar cuidador" });
  }
};

// Cada cuidador enxerga apenas a própria conta.
const listar = async (req, res) => {
  try {
    const cuidador = await buscarCuidadorPorId(req.cuidador.id_cuidador);
    return res.status(200).json(cuidador ? [cuidador] : []);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar cuidadores" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const cuidador = await buscarCuidadorPorId(req.params.id);
    if (!cuidador) {
      return res.status(404).json({ error: "Nenhum cuidador encontrado!" });
    }
    return res.status(200).json(cuidador);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar cuidador" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const erro = validar({ nome, email, senha }, { parcial: true });
    if (erro) return res.status(400).json({ error: erro });

    const cuidador = await atualizarCuidadorPorId(req.params.id, nome, email, senha);
    if (!cuidador) {
      return res.status(404).json({ error: "Nenhum cuidador encontrado!" });
    }
    return res.status(200).json(cuidador);
  } catch (error) {
    if (emailDuplicado(error)) {
      return res.status(409).json({ error: "Este e-mail já está cadastrado" });
    }
    return res.status(500).json({ error: "Erro ao atualizar cuidador" });
  }
};

const deletar = async (req, res) => {
  try {
    const resultado = await deletarCuidadorPorId(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Nenhum cuidador encontrado!" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar cuidador" });
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };
