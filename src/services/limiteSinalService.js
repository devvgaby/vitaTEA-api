const { LimiteSinal } = require("../models");

const criarLimiteSinal = async (
  id_monitorado,
  id_tipo_sinal,
  valor_min,
  valor_max,
) => {
  const limiteSinal = await LimiteSinal.create({
    id_monitorado,
    id_tipo_sinal,
    valor_min,
    valor_max,
  });

  return {
    id_limite_sinal: limiteSinal.id_limite_sinal,
    id_monitorado: limiteSinal.id_monitorado,
    id_tipo_sinal: limiteSinal.id_tipo_sinal,
    valor_min: limiteSinal.valor_min,
    valor_max: limiteSinal.valor_max,
  };
};

const listarLimitesSinais = async () => {
  return await LimiteSinal.findAll();
};

const buscarLimiteSinalPorId = async (id_limite_sinal) => {
  return await LimiteSinal.findByPk(id_limite_sinal);
};

const buscarLimiteSinalPorMonitorado = async (
  id_limite_sinal,
  id_monitorado,
) => {
  return await LimiteSinal.findOne({
    where: {
      id_limite_sinal,
      id_monitorado,
    },
  });
};

const atualizarLimiteSinalPorId = async (
  id_limite_sinal,
  id_monitorado,
  id_tipo_sinal,
  valor_min,
  valor_max,
) => {
  const limiteSinal = await LimiteSinal.findByPk(id_limite_sinal);

  if (!limiteSinal) {
    return null;
  }

  if (id_monitorado !== undefined) {
    limiteSinal.id_monitorado = id_monitorado;
  }

  if (id_tipo_sinal !== undefined) {
    limiteSinal.id_tipo_sinal = id_tipo_sinal;
  }

  if (valor_min !== undefined) {
    limiteSinal.valor_min = valor_min;
  }

  if (valor_max !== undefined) {
    limiteSinal.valor_max = valor_max;
  }

  await limiteSinal.save();

  return {
    id_limite_sinal: limiteSinal.id_limite_sinal,
    id_monitorado: limiteSinal.id_monitorado,
    id_tipo_sinal: limiteSinal.id_tipo_sinal,
    valor_min: limiteSinal.valor_min,
    valor_max: limiteSinal.valor_max,
  };
};

const deletarLimiteSinalPorId = async (id_limite_sinal) => {
  const limiteSinal = await LimiteSinal.findByPk(id_limite_sinal);

  if (!limiteSinal) {
    return null;
  }

  await limiteSinal.destroy();

  return true;
};

module.exports = {
  criarLimiteSinal,
  listarLimitesSinais,
  buscarLimiteSinalPorId,
  buscarLimiteSinalPorMonitorado,
  atualizarLimiteSinalPorId,
  deletarLimiteSinalPorId,
};
