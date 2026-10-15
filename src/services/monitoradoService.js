const {
  Monitorado,
  CuidadorMonitorado,
  ContatoEmergencia,
  LimiteSinal,
  Dispositivo,
  sequelize,
} = require("../models");

const formatar = (monitorado) => ({
  id_monitorado: monitorado.id_monitorado,
  nome: monitorado.nome,
  idade: monitorado.idade,
  nivel_tea: monitorado.nivel_tea,
});

const criarMonitorado = async (nome, idade, nivel_tea, id_cuidador) => {
  return sequelize.transaction(async (transaction) => {
    const monitorado = await Monitorado.create({ nome, idade, nivel_tea }, { transaction });

    if (id_cuidador) {
      await CuidadorMonitorado.create(
        { id_cuidador, id_monitorado: monitorado.id_monitorado },
        { transaction },
      );
    }

    return formatar(monitorado);
  });
};

const listarMonitorados = async (ids) => {
  return await Monitorado.findAll({ where: { id_monitorado: ids } });
};

const buscarMonitoradoPorId = async (id_monitorado) => {
  return await Monitorado.findByPk(id_monitorado);
};

const atualizarMonitoradoPorId = async (id_monitorado, nome, idade, nivel_tea) => {
  const monitorado = await Monitorado.findByPk(id_monitorado);

  if (!monitorado) return null;

  if (nome) monitorado.nome = nome;
  if (idade) monitorado.idade = idade;
  if (nivel_tea) monitorado.nivel_tea = nivel_tea;

  await monitorado.save();

  return formatar(monitorado);
};

const deletarMonitoradoPorId = async (id_monitorado) => {
  return sequelize.transaction(async (transaction) => {
    const monitorado = await Monitorado.findByPk(id_monitorado, { transaction });

    if (!monitorado) return null;

    await ContatoEmergencia.destroy({ where: { id_monitorado }, transaction });
    await LimiteSinal.destroy({ where: { id_monitorado }, transaction });
    await CuidadorMonitorado.destroy({ where: { id_monitorado }, transaction });

    const dispositivo = await Dispositivo.findOne({ where: { id_monitorado }, transaction });
    if (dispositivo) {
      dispositivo.codigo = `${dispositivo.codigo}#removido-${dispositivo.id_dispositivo}`;
      await dispositivo.save({ transaction });
      await dispositivo.destroy({ transaction });
    }

    await monitorado.destroy({ transaction });

    return true;
  });
};

module.exports = {
  criarMonitorado,
  listarMonitorados,
  buscarMonitoradoPorId,
  atualizarMonitoradoPorId,
  deletarMonitoradoPorId,
};
