const {
  criarCuidadorMonitorado,
  listarCuidadoresMonitorados,
  buscarCuidadorMonitoradoPorId,
  deletarCuidadorMonitoradoPorId,
} = require("../services/cuidadorMonitoradoService");
const { Cuidador, Monitorado } = require("../models");
const {
  cuidadorTemAcesso,
  monitoradoTemCuidador,
} = require("../services/acessoService");

const criar = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.body;

    if (!id_cuidador || !id_monitorado) {
      return res.status(400).json({
        error: "id_cuidador e id_monitorado são obrigatórios",
      });
    }

    const [cuidador, monitorado] = await Promise.all([
      Cuidador.findByPk(id_cuidador),
      Monitorado.findByPk(id_monitorado),
    ]);

    if (!cuidador || !monitorado) {
      return res.status(404).json({ error: "Cuidador ou monitorado não encontrado" });
    }

    const solicitante = req.cuidador.id_cuidador;
    const temAcesso = await cuidadorTemAcesso(solicitante, id_monitorado);
    const semDono = !(await monitoradoTemCuidador(id_monitorado));
    const vinculoProprio = Number(id_cuidador) === Number(solicitante);

    if (!temAcesso && !(semDono && vinculoProprio)) {
      return res.status(403).json({ error: "Acesso negado a este monitorado" });
    }

    const vinculo = await criarCuidadorMonitorado(id_cuidador, id_monitorado);

    return res.status(201).json(vinculo);
  } catch {
    return res.status(500).json({ error: "Erro ao criar relacionamento" });
  }
};

const listar = async (req, res) => {
  try {
    const vinculos = await listarCuidadoresMonitorados(req.idsMonitorados);
    return res.status(200).json(vinculos);
  } catch {
    return res.status(500).json({ error: "Erro ao listar relacionamentos" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.params;

    const vinculo = await buscarCuidadorMonitoradoPorId(id_cuidador, id_monitorado);

    if (!vinculo) {
      return res.status(404).json({ error: "Relacionamento não encontrado" });
    }

    return res.status(200).json(vinculo);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar relacionamento" });
  }
};

const remover = async (req, res) => {
  try {
    const { id_cuidador, id_monitorado } = req.params;

    const removido = await deletarCuidadorMonitoradoPorId(id_cuidador, id_monitorado);

    if (!removido) {
      return res.status(404).json({ error: "Relacionamento não encontrado" });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Erro ao remover relacionamento" });
  }
};

module.exports = { criar, listar, buscarPorId, remover };
