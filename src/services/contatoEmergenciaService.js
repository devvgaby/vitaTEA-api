const { ContatoEmergencia } = require("../models");

const criarContatoEmergencia = async (
  id_monitorado,
  nome,
  telefone,
  parentesco,
) => {
  const contatoEmergencia = await ContatoEmergencia.create({
    id_monitorado,
    nome,
    telefone,
    parentesco,
  });

  return {
    id_contato_emergencia: contatoEmergencia.id_contato_emergencia,
    id_monitorado: contatoEmergencia.id_monitorado,
    nome: contatoEmergencia.nome,
    telefone: contatoEmergencia.telefone,
    parentesco: contatoEmergencia.parentesco,
  };
};

const listarContatosEmergencia = async (id_monitorado) => {
  return await ContatoEmergencia.findAll();
};

const buscarContatoEmergenciaPorId = async (id_contato_emergencia) => {
  return await ContatoEmergencia.findByPk(id_contato_emergencia);
};

const atualizarContatoEmergenciaPorId = async (
  id_contato_emergencia,
  nome,
  telefone,
  parentesco,
) => {
  const contatoEmergencia = await ContatoEmergencia.findByPk(
    id_contato_emergencia,
  );

  if (!contatoEmergencia) return null;

  if (nome) contatoEmergencia.nome = nome;
  if (telefone) contatoEmergencia.telefone = telefone;
  if (parentesco) contatoEmergencia.parentesco = parentesco;

  await contatoEmergencia.save();

  return {
    id_contato_emergencia: contatoEmergencia.id_contato_emergencia,
    id_monitorado: contatoEmergencia.id_monitorado,
    nome: contatoEmergencia.nome,
    telefone: contatoEmergencia.telefone,
    parentesco: contatoEmergencia.parentesco,
  };
};
const deletarContatoEmergenciaPorId = async (id_contato_emergencia) => {
  const contatoEmergencia = await ContatoEmergencia.findByPk(
    id_contato_emergencia,
  );

  if (!contatoEmergencia) return null;

  await contatoEmergencia.destroy();

  return true;
};

module.exports = {
  criarContatoEmergencia,
  listarContatosEmergencia,
  buscarContatoEmergenciaPorId,
  atualizarContatoEmergenciaPorId,
  deletarContatoEmergenciaPorId,
};
