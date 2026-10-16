const {
  criarLeituraDispositivo,
  listarLeiturasDispositivos,
  buscarLeituraDispositivoPorId,
  buscarLeiturasDispositivoPorDispositivo,
  atualizarLeituraDispositivoPorId,
  deletarLeituraDispositivoPorId,
} = require("../services/leituraDispositivoService");

const criar = async (req, res) => {
  try {
    const { id_tipo_sinal, valor, data_hora } = req.body;
    const { id_dispositivo } = req.dispositivo;

    if (!id_tipo_sinal || valor === undefined || !data_hora) {
      return res
        .status(400)
        .json({ error: "id_tipo_sinal, valor e data_hora são obrigatórios" });
    }

    if (!Number.isFinite(Number(valor))) {
      return res.status(400).json({ error: "valor deve ser numérico" });
    }

    const { leitura, alerta } = await criarLeituraDispositivo(
      id_dispositivo,
      id_tipo_sinal,
      valor,
      data_hora,
    );

    return res.status(201).json({ leitura, alerta });
  } catch (error) {
    console.error("[leitura] erro ao registrar leitura:", error);
    return res.status(500).json({ error: "Erro ao registrar leitura do dispositivo" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id_leitura_dispositivo } = req.params;
    const leitura = await buscarLeituraDispositivoPorId(id_leitura_dispositivo);

    if (!leitura) {
      return res.status(404).json({ error: "Leitura dispositivo não encontrada" });
    }

    return res.status(200).json(leitura);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar leitura" });
  }
};

const listar = async (req, res) => {
  try {
    const leituras = await listarLeiturasDispositivos(req.idsMonitorados);
    return res.status(200).json(leituras);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar leituras" });
  }
};

const buscarPorDispositivo = async (req, res) => {
  try {
    const { id_dispositivo } = req.params;
    const { desde, limite } = req.query;
    const leituras = await buscarLeiturasDispositivoPorDispositivo(id_dispositivo, { desde, limite });
    return res.status(200).json(leituras);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar leituras do dispositivo" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id_leitura_dispositivo } = req.params;
    const leitura = await atualizarLeituraDispositivoPorId(
      id_leitura_dispositivo,
      req.body,
    );

    if (!leitura) {
      return res.status(404).json({ error: "Leitura dispositivo não encontrada" });
    }

    return res.status(200).json(leitura);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar leitura" });
  }
};

const deletar = async (req, res) => {
  try {
    const { id_leitura_dispositivo } = req.params;
    const resultado = await deletarLeituraDispositivoPorId(id_leitura_dispositivo);

    if (!resultado) {
      return res.status(404).json({ error: "Leitura dispositivo não encontrada" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar leitura" });
  }
};

module.exports = {
  criar,
  buscarPorId,
  listar,
  buscarPorDispositivo,
  atualizar,
  deletar,
};
