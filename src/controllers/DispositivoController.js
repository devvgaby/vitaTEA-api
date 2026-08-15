const {
  criarDispositivo,
  listarDispositivos,
  buscarDispositivoPorMonitorado,
  buscarDispositivoPorId,
  atualizarDispositivoPorId,
  deletarDispositivoPorId,
} = require("../services/dispositivoService");
const { JANELA_CONEXAO_MS } = require("../config/constants");

const criar = async (req, res) => {
  try {
    const { codigo, id_monitorado } = req.body;

    if (!codigo || !id_monitorado) {
      return res.status(400).json({
        error: "Código e ID do monitorado são obrigatórios",
      });
    }

    const dispositivo = await criarDispositivo(codigo, id_monitorado);

    return res.status(201).json(dispositivo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao vincular dispositivo" });
  }
};

const listar = async (req, res) => {
  try {
    const dispositivos = await listarDispositivos();
    return res.json(dispositivos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar dispositivos" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dispositivo = await buscarDispositivoPorId(id);

    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo não encontrado" });
    }

    return res.json(dispositivo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dispositivo" });
  }
};

const buscarPorMonitorado = async (req, res) => {
  try {
    const { id_dispositivo, id_monitorado } = req.params;

    const dispositivo = await buscarDispositivoPorMonitorado(
      id_dispositivo,
      id_monitorado,
    );

    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo não encontrado" });
    }

    return res.status(200).json(dispositivo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dispositivo do monitorado" });
  }
};

// RF20 — status de conexão calculado a partir da última leitura recebida.
const status = async (req, res) => {
  try {
    const { id } = req.params;
    const dispositivo = await buscarDispositivoPorId(id);

    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo não encontrado" });
    }

    const ultimaConexao = dispositivo.ultima_conexao;
    const conectado = ultimaConexao
      ? Date.now() - new Date(ultimaConexao).getTime() <= JANELA_CONEXAO_MS
      : false;

    return res.status(200).json({
      id_dispositivo: dispositivo.id_dispositivo,
      conectado,
      ultima_conexao: ultimaConexao,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar status do dispositivo" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, id_monitorado } = req.body;

    const dispositivo = await atualizarDispositivoPorId(id, codigo, id_monitorado);

    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo não encontrado" });
    }

    return res.json(dispositivo);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar dispositivo" });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const dispositivo = await deletarDispositivoPorId(id);

    if (!dispositivo) {
      return res.status(404).json({ error: "Dispositivo não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar dispositivo" });
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  buscarPorMonitorado,
  status,
  atualizar,
  deletar,
};
