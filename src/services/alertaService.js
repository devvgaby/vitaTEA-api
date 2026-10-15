const {
  Alerta,
  LeituraDispositivo,
  Dispositivo,
  TipoSinal,
  LimiteSinal,
} = require("../models");
const { LIMITES_PADRAO, FAIXAS_CRITICIDADE } = require("../config/constants");
const { notificarAlerta } = require("./notificacaoService");

const calcularCriticidade = (valor, valor_min, valor_max) => {
  const amplitude = valor_max - valor_min || 1;
  let desvio = 0;

  if (valor < valor_min) {
    desvio = (valor_min - valor) / amplitude;
  } else if (valor > valor_max) {
    desvio = (valor - valor_max) / amplitude;
  } else {
    return null; 
  }

  const faixa = FAIXAS_CRITICIDADE.find((f) => desvio <= f.ateDesvio);
  return faixa ? faixa.nivel : "critico";
};

const avaliarLeitura = async (leitura) => {
  const dispositivo = await Dispositivo.findByPk(leitura.id_dispositivo);
  if (!dispositivo) return null;

  const tipoSinal = await TipoSinal.findByPk(leitura.id_tipo_sinal);
  if (!tipoSinal) return null;

  let limite = await LimiteSinal.findOne({
    where: {
      id_monitorado: dispositivo.id_monitorado,
      id_tipo_sinal: leitura.id_tipo_sinal,
    },
  });

  const padrao = LIMITES_PADRAO[tipoSinal.nome];

  const valor_min = limite ? Number(limite.valor_min) : padrao?.valor_min;
  const valor_max = limite ? Number(limite.valor_max) : padrao?.valor_max;

  if (valor_min === undefined || valor_max === undefined) {
    return null; 
  }

  const valor = Number(leitura.valor);
  const nivel_criticidade = calcularCriticidade(valor, valor_min, valor_max);

  if (!nivel_criticidade) {
    return null; 
  }

  const direcao = valor < valor_min ? "abaixo do" : "acima do";
  const mensagem = `${tipoSinal.nome} em ${valor}${tipoSinal.unidade_medida} está ${direcao} limite esperado (${valor_min}–${valor_max}${tipoSinal.unidade_medida}).`;

  const alerta = await Alerta.create({
    id_leitura_dispositivo: leitura.id_leitura_dispositivo,
    mensagem,
    nivel_criticidade,
    data_hora: leitura.data_hora,
  });

  notificarAlerta({
    alerta,
    id_monitorado: dispositivo.id_monitorado,
    nomeSinal: tipoSinal.nome,
  }).catch((erro) => console.error(`Falha ao notificar alerta: ${erro.message}`));

  return alerta;
};

const listarAlertasPorMonitorado = async (id_monitorado) => {
  return await Alerta.findAll({
    include: [
      {
        model: LeituraDispositivo,
        required: true,
        include: [
          {
            model: Dispositivo,
            required: true,
            where: { id_monitorado },
          },
          { model: TipoSinal },
        ],
      },
    ],
    order: [["data_hora", "DESC"]],
  });
};

const buscarAlertaPorId = async (id_alerta) => {
  return await Alerta.findByPk(id_alerta, {
    include: [
      {
        model: LeituraDispositivo,
        include: [{ model: Dispositivo }, { model: TipoSinal }],
      },
    ],
  });
};

const marcarAlertaVisualizado = async (id_alerta) => {
  const alerta = await Alerta.findByPk(id_alerta);
  if (!alerta) return null;

  alerta.visualizado = true;
  await alerta.save();
  return alerta;
};

const deletarAlertaPorId = async (id_alerta) => {
  const alerta = await Alerta.findByPk(id_alerta);
  if (!alerta) return null;

  await alerta.destroy();   
  return true;
};

module.exports = {
  avaliarLeitura,
  listarAlertasPorMonitorado,
  buscarAlertaPorId,
  marcarAlertaVisualizado,
  deletarAlertaPorId,
};
