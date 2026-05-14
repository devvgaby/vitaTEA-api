const { TipoSinal } = require("../models");

const criarTipoSinal = async (nome, unidade_medida) => {
  const tipoSinal = await TipoSinal.create({
    nome,
    unidade_medida,
  });

  return tipoSinal;
};

const listarTiposSinais = async () => {
  return await TipoSinal.findAll();
};

const buscarTipoSinalPorId = async (id_tipo_sinal) => {
  return await TipoSinal.findByPk(id_tipo_sinal);
};

const atualizarTipoSinalPorId = async (id_tipo_sinal, nome, unidade_medida) => {
  const tipoSinal = await TipoSinal.findByPk(id_tipo_sinal);

  if (!tipoSinal) return null;

  if (nome) tipoSinal.nome = nome;
  if (unidade_medida) tipoSinal.unidade_medida = unidade_medida;

  await tipoSinal.save();

  return tipoSinal;
};

const deletarTipoSinalPorId = async (id_tipo_sinal) => {
  const tipoSinal = await TipoSinal.findByPk(id_tipo_sinal);

  if (!tipoSinal) return null;

  await tipoSinal.destroy();

  return true;
};

module.exports = {
  criarTipoSinal,
  listarTiposSinais,
  buscarTipoSinalPorId,
  atualizarTipoSinalPorId,
  deletarTipoSinalPorId,
};
