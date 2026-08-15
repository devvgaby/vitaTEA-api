const {
  listarAlertasPorMonitorado,
  buscarAlertaPorId,
  marcarAlertaVisualizado,
  deletarAlertaPorId,
} = require("../services/alertaService");

const listarPorMonitorado = async (req, res) => {
  try {
    const { id_monitorado } = req.params;
    const alertas = await listarAlertasPorMonitorado(id_monitorado);
    return res.status(200).json(alertas);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar alertas" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id_alerta } = req.params;
    const alerta = await buscarAlertaPorId(id_alerta);

    if (!alerta) {
      return res.status(404).json({ error: "Alerta não encontrado" });
    }

    return res.status(200).json(alerta);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar alerta" });
  }
};

const marcarVisualizado = async (req, res) => {
  try {
    const { id_alerta } = req.params;
    const alerta = await marcarAlertaVisualizado(id_alerta);

    if (!alerta) {
      return res.status(404).json({ error: "Alerta não encontrado" });
    }

    return res.status(200).json(alerta);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar alerta" });
  }
};

const deletar = async (req, res) => {
  try {
    const { id_alerta } = req.params;
    const resultado = await deletarAlertaPorId(id_alerta);

    if (!resultado) {
      return res.status(404).json({ error: "Alerta não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar alerta" });
  }
};

module.exports = { listarPorMonitorado, buscarPorId, marcarVisualizado, deletar };
