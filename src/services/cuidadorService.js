const { Cuidador } = require("../models");
const bcrypt = require("bcrypt");

const criarCuidador = async (nome, email, senha) => {
  const senhaHash = await bcrypt.hash(senha, 10);

  const cuidador = await Cuidador.create({
    nome,
    email,
    senha: senhaHash,
  });

  return {
    id_cuidador: cuidador.id_cuidador,
    nome: cuidador.nome,
    email: cuidador.email,
  };
};

const listarCuidadores = async () => {
  return await Cuidador.findAll({
    attributes: { exclude: ["senha"] },
  });
};

const buscarCuidadorPorId = async (id_cuidador) => {
  return await Cuidador.findByPk(id_cuidador, {
    attributes: { exclude: ["senha"] },
  });
};

const atualizarCuidadorPorId = async (id_cuidador, nome, email, senha) => {
  const cuidador = await Cuidador.findByPk(id_cuidador);

  if (!cuidador) return null;

  if (nome) cuidador.nome = nome;
  if (email) cuidador.email = email;

  if (senha) {
    cuidador.senha = await bcrypt.hash(senha, 10);
  }

  await cuidador.save();

  return {
    id_cuidador: cuidador.id_cuidador,
    nome: cuidador.nome,
    email: cuidador.email,
  };
};

const deletarCuidadorPorId = async (id_cuidador) => {
  const cuidador = await Cuidador.findByPk(id_cuidador);

  if (!cuidador) return null;

  await cuidador.destroy();

  return true;
};

module.exports = {
  criarCuidador,
  listarCuidadores,
  buscarCuidadorPorId,
  atualizarCuidadorPorId,
  deletarCuidadorPorId,
};