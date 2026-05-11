const bcrypt = require("bcrypt");
const { Cuidador } = require("../models");

const criar = async (req, res) => {

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios",
    });
  }

  try {

    const senhaHash = await bcrypt.hash(senha, 10);

    const cuidador = await Cuidador.create({
      nome,
      email,
      senha: senhaHash,
    });

    return res.status(201).json({
      id_cuidador: cuidador.id_cuidador,
      nome: cuidador.nome,
      email: cuidador.email,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar cuidador",
    });
  }
};

const listar = async (req, res) => {

  const cuidadores = await Cuidador.findAll({
    attributes: {
      exclude: ["senha"],
    },
  });

  return res.status(200).json(cuidadores);
};

const buscarPorId = async (req, res) => {

  const { id } = req.params;

  const cuidador = await Cuidador.findByPk(id, {
    attributes: {
      exclude: ["senha"],
    },
  });

  if (!cuidador) {
    return res.status(404).json({
      error: "Nenhum cuidador encontrado!",
    });
  }

  return res.status(200).json(cuidador);
};

const atualizar = async (req, res) => {

  const { id } = req.params;
  const { nome, email, senha } = req.body;

  const cuidador = await Cuidador.findByPk(id);

  if (!cuidador) {
    return res.status(404).json({
      error: "Nenhum cuidador encontrado!",
    });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  cuidador.nome = nome;
  cuidador.email = email;
  cuidador.senha = senhaHash;

  await cuidador.save();

  return res.status(200).json({
    id_cuidador: cuidador.id_cuidador,
    nome: cuidador.nome,
    email: cuidador.email,
  });
};

const deletar = async (req, res) => {

  const { id } = req.params;

  const cuidador = await Cuidador.findByPk(id);

  if (!cuidador) {
    return res.status(404).json({
      error: "Nenhum cuidador encontrado!",
    });
  }

  await cuidador.destroy();

  return res.status(204).send();
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
};  