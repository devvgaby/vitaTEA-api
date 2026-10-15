const { Op } = require("sequelize");
const {
  Monitorado,
  Dispositivo,
  LeituraDispositivo,
  Alerta,
  TipoSinal,
  LimiteSinal,
} = require("../models");
const { LIMITES_PADRAO } = require("../config/constants");

const HORA = 60 * 60 * 1000;
const PERIODOS = {
  "1h": HORA,
  "6h": 6 * HORA,
  "24h": 24 * HORA,
  "7d": 7 * 24 * HORA,
  "30d": 30 * 24 * HORA,
};
const PONTOS_NA_SERIE = 60;
const LIMITE_DE_LEITURAS = 200000;

const arredondar = (valor, casas = 1) => {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
};

const resolverPeriodo = ({ periodo, desde, ate } = {}) => {
  const fim = ate ? new Date(ate) : new Date();

  if (desde) {
    const inicio = new Date(desde);
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || inicio >= fim) {
      return null;
    }
    return { desde: inicio, ate: fim };
  }

  const duracao = PERIODOS[periodo || "24h"];
  if (!duracao || Number.isNaN(fim.getTime())) return null;

  return { desde: new Date(fim.getTime() - duracao), ate: fim };
};

const idsDosDispositivos = async (id_monitorado) => {
  const dispositivos = await Dispositivo.findAll({
    where: { id_monitorado },
    attributes: ["id_dispositivo"],
    paranoid: false,
  });
  return dispositivos.map((d) => d.id_dispositivo);
};

const buscarLeituras = async (idsDispositivos, { desde, ate }, limite = LIMITE_DE_LEITURAS) => {
  if (idsDispositivos.length === 0) return [];

  return await LeituraDispositivo.findAll({
    where: {
      id_dispositivo: idsDispositivos,
      data_hora: { [Op.between]: [desde, ate] },
    },
    attributes: ["id_tipo_sinal", "valor", "data_hora"],
    order: [["data_hora", "ASC"]],
    limit: limite,
    raw: true,
  });
};

const gerarRelatorio = async (id_monitorado, opcoes) => {
  const periodo = resolverPeriodo(opcoes);
  if (!periodo) return { erro: "Período inválido" };

  const monitorado = await Monitorado.findByPk(id_monitorado);
  if (!monitorado) return { erro: "Monitorado não encontrado", naoEncontrado: true };

  const [tipos, limitesPersonalizados, idsDispositivos] = await Promise.all([
    TipoSinal.findAll(),
    LimiteSinal.findAll({ where: { id_monitorado } }),
    idsDosDispositivos(id_monitorado),
  ]);

  const leituras = await buscarLeituras(idsDispositivos, periodo);

  const inicio = periodo.desde.getTime();
  const duracao = periodo.ate.getTime() - inicio;
  const tamanhoBalde = Math.max(Math.ceil(duracao / PONTOS_NA_SERIE), 1000);

  const sinais = tipos.map((tipo) => {
    const personalizado = limitesPersonalizados.find((l) => l.id_tipo_sinal === tipo.id_tipo_sinal);
    const padrao = LIMITES_PADRAO[tipo.nome];
    const limites =
      personalizado
        ? { min: Number(personalizado.valor_min), max: Number(personalizado.valor_max), personalizado: true }
        : padrao
          ? { min: padrao.valor_min, max: padrao.valor_max, personalizado: false }
          : null;

    const doTipo = leituras.filter((l) => l.id_tipo_sinal === tipo.id_tipo_sinal);

    let soma = 0;
    let minimo = Infinity;
    let maximo = -Infinity;
    let fora = 0;
    const baldes = new Map();

    for (const leitura of doTipo) {
      const valor = Number(leitura.valor);
      soma += valor;
      if (valor < minimo) minimo = valor;
      if (valor > maximo) maximo = valor;
      if (limites && (valor < limites.min || valor > limites.max)) fora += 1;

      const indice = Math.floor((new Date(leitura.data_hora).getTime() - inicio) / tamanhoBalde);
      const balde = baldes.get(indice) || { soma: 0, n: 0, min: Infinity, max: -Infinity };
      balde.soma += valor;
      balde.n += 1;
      balde.min = Math.min(balde.min, valor);
      balde.max = Math.max(balde.max, valor);
      baldes.set(indice, balde);
    }

    const total = doTipo.length;

    return {
      id_tipo_sinal: tipo.id_tipo_sinal,
      nome: tipo.nome,
      unidade_medida: tipo.unidade_medida,
      limites,
      total,
      media: total ? arredondar(soma / total) : null,
      minimo: total ? arredondar(minimo) : null,
      maximo: total ? arredondar(maximo) : null,
      fora_dos_limites: fora,
      percentual_fora: total ? arredondar((fora / total) * 100) : 0,
      serie: [...baldes.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([indice, balde]) => ({
          t: new Date(inicio + indice * tamanhoBalde + tamanhoBalde / 2).toISOString(),
          media: arredondar(balde.soma / balde.n),
          min: arredondar(balde.min),
          max: arredondar(balde.max),
          n: balde.n,
        })),
    };
  });

  const alertas = await Alerta.findAll({
    include: [
      {
        model: LeituraDispositivo,
        required: true,
        attributes: ["id_tipo_sinal"],
        include: [{ model: Dispositivo, required: true, paranoid: false, where: { id_monitorado }, attributes: [] }],
      },
    ],
    where: { data_hora: { [Op.between]: [periodo.desde, periodo.ate] } },
    order: [["data_hora", "DESC"]],
  });

  const porNivel = { baixo: 0, medio: 0, alto: 0, critico: 0 };
  alertas.forEach((a) => {
    porNivel[a.nivel_criticidade] += 1;
  });

  return {
    monitorado: {
      id_monitorado: monitorado.id_monitorado,
      nome: monitorado.nome,
      idade: monitorado.idade,
      nivel_tea: monitorado.nivel_tea,
    },
    periodo: { desde: periodo.desde.toISOString(), ate: periodo.ate.toISOString() },
    gerado_em: new Date().toISOString(),
    total_leituras: leituras.length,
    sinais,
    alertas: {
      total: alertas.length,
      por_nivel: porNivel,
      recentes: alertas.slice(0, 10).map((a) => ({
        id_alerta: a.id_alerta,
        mensagem: a.mensagem,
        nivel_criticidade: a.nivel_criticidade,
        data_hora: a.data_hora,
      })),
    },
  };
};

const escaparCsv = (valor) => {
  const texto = String(valor ?? "");
  return /[",;\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
};

const gerarCsv = async (id_monitorado, opcoes) => {
  const periodo = resolverPeriodo(opcoes);
  if (!periodo) return { erro: "Período inválido" };

  const [tipos, idsDispositivos] = await Promise.all([
    TipoSinal.findAll(),
    idsDosDispositivos(id_monitorado),
  ]);

  const leituras = await buscarLeituras(idsDispositivos, periodo, 50000);
  const tipoPorId = new Map(tipos.map((t) => [t.id_tipo_sinal, t]));

  const linhas = ["data_hora;sinal;valor;unidade"];
  leituras.forEach((l) => {
    const tipo = tipoPorId.get(l.id_tipo_sinal);
    linhas.push(
      [
        new Date(l.data_hora).toISOString(),
        escaparCsv(tipo?.nome),
        String(Number(l.valor)).replace(".", ","),
        escaparCsv(tipo?.unidade_medida),
      ].join(";"),
    );
  });

  return { csv: `\uFEFF${linhas.join("\n")}\n` };
};

module.exports = { gerarRelatorio, gerarCsv, resolverPeriodo, PERIODOS };
