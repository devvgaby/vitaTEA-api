const {
  criarMonitorado,
  listarMonitorados,
  buscarMonitoradoPorId,
  atualizarMonitoradoPorId,
  deletarMonitoradoPorId,
} = require("../services/monitoradoService");

const NIVEIS_TEA = ["2", "3"];

// Retorna a mensagem de erro de validação (ou null se estiver tudo certo).
const validar = ({ nome, idade, nivel_tea }, { parcial = false } = {}) => {
  if (!parcial && (!nome || !idade || !nivel_tea)) {
    return "Nome, idade e nível TEA são obrigatórios";
  }
  if (nome !== undefined && !String(nome).trim()) {
    return "O nome não pode ser vazio";
  }
  if (idade !== undefined) {
    const valor = Number(idade);
    if (!Number.isInteger(valor) || valor < 1 || valor > 120) {
      return "A idade deve ser um número inteiro entre 1 e 120";
    }
  }
  if (nivel_tea !== undefined && !NIVEIS_TEA.includes(String(nivel_tea))) {
    return "O nível TEA deve ser 2 ou 3";
  }
  return null;
};

const criar = async (req, res) => {
  try {
    const { nome, idade, nivel_tea } = req.body;

    const erro = validar({ nome, idade, nivel_tea });
    if (erro) return res.status(400).json({ error: erro });

    const monitorado = await criarMonitorado(
      String(nome).trim(),
      Number(idade),
      String(nivel_tea),
      req.cuidador.id_cuidador,
    );

    return res.status(201).json(monitorado);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar monitorado" });
  }
};

const listar = async (req, res) => {
  try {
    const monitorados = await listarMonitorados(req.idsMonitorados);
    return res.status(200).json(monitorados);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar monitorados" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const monitorado = await buscarMonitoradoPorId(req.params.id);
    if (!monitorado) {
      return res.status(404).json({ error: "Monitorado não encontrado" });
    }

    return res.status(200).json(monitorado);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar monitorado" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { nome, idade, nivel_tea } = req.body;

    const erro = validar({ nome, idade, nivel_tea }, { parcial: true });
    if (erro) return res.status(400).json({ error: erro });

    const monitorado = await atualizarMonitoradoPorId(
      req.params.id,
      nome === undefined ? undefined : String(nome).trim(),
      idade === undefined ? undefined : Number(idade),
      nivel_tea === undefined ? undefined : String(nivel_tea),
    );

    if (!monitorado) {
      return res.status(404).json({ error: "Monitorado não encontrado" });
    }

    return res.status(200).json(monitorado);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar monitorado" });
  }
};

const deletar = async (req, res) => {
  try {
    const resultado = await deletarMonitoradoPorId(req.params.id);

    if (!resultado) {
      return res.status(404).json({ error: "Monitorado não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar monitorado" });
  }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };
