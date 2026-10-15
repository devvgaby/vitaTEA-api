const {
  CuidadorMonitorado,
  Dispositivo,
  LeituraDispositivo,
  Alerta,
  ContatoEmergencia,
  LimiteSinal,
} = require("../models");


const idsMonitoradosDoCuidador = async (id_cuidador) => {
  const vinculos = await CuidadorMonitorado.findAll({
    where: { id_cuidador },
    attributes: ["id_monitorado"],
  });
  return vinculos.map((v) => v.id_monitorado);
};

const cuidadorTemAcesso = async (id_cuidador, id_monitorado) => {
  const vinculo = await CuidadorMonitorado.findOne({
    where: { id_cuidador, id_monitorado },
  });
  return Boolean(vinculo);
};

const monitoradoTemCuidador = async (id_monitorado) => {
  const total = await CuidadorMonitorado.count({ where: { id_monitorado } });
  return total > 0;
};

const monitoradoDoDispositivo = async (id_dispositivo) => {
  const dispositivo = await Dispositivo.findByPk(id_dispositivo, { paranoid: false });
  return dispositivo ? dispositivo.id_monitorado : null;
};

const monitoradoDaLeitura = async (id_leitura_dispositivo) => {
  const leitura = await LeituraDispositivo.findByPk(id_leitura_dispositivo);
  return leitura ? monitoradoDoDispositivo(leitura.id_dispositivo) : null;
};

const monitoradoDoAlerta = async (id_alerta) => {
  const alerta = await Alerta.findByPk(id_alerta);
  return alerta ? monitoradoDaLeitura(alerta.id_leitura_dispositivo) : null;
};

const monitoradoDoContato = async (id_contato_emergencia) => {
  const contato = await ContatoEmergencia.findByPk(id_contato_emergencia);
  return contato ? contato.id_monitorado : null;
};

const monitoradoDoLimite = async (id_limite_sinal) => {
  const limite = await LimiteSinal.findByPk(id_limite_sinal);
  return limite ? limite.id_monitorado : null;
};

module.exports = {
  idsMonitoradosDoCuidador,
  cuidadorTemAcesso,
  monitoradoTemCuidador,
  monitoradoDoDispositivo,
  monitoradoDaLeitura,
  monitoradoDoAlerta,
  monitoradoDoContato,
  monitoradoDoLimite,
};
