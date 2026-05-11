const { ContatoEmergencia, Monitorado } = require("../models");

const criar = async (req, res) => {

  const {
    nome,
    telefone,
    parentesco,
    id_monitorado,
  } = req.body;

  if (
    !nome ||
    !telefone ||
    !parentesco ||
    !id_monitorado
  ) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios",
    });
  }

  try {

    const monitorado = await Monitorado.findByPk(
      id_monitorado
    );

    if (!monitorado) {
      return res.status(404).json({
        error: "Monitorado não encontrado",
      });
    }

    const contato = await ContatoEmergencia.create({
      nome,
      telefone,
      parentesco,
      id_monitorado,
    });

    return res.status(201).json(contato);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar contato de emergência",
    });
  }
};

const listar = async (req, res) => {

  const contatos = await ContatoEmergencia.findAll();

  return res.status(200).json(contatos);
};

const buscarPorId = async (req, res) => {

  const { id } = req.params;

  const contato = await ContatoEmergencia.findByPk(id);

  if (!contato) {
    return res.status(404).json({
      error: "Contato de emergência não encontrado",
    });
  }

  return res.status(200).json(contato);
};

const atualizar = async (req, res) => {

  const { id } = req.params;

  const {
    nome,
    telefone,
    parentesco,
    id_monitorado,
  } = req.body;

  const contato = await ContatoEmergencia.findByPk(id);

  if (!contato) {
    return res.status(404).json({
      error: "Contato de emergência não encontrado",
    });
  }

  const monitorado = await Monitorado.findByPk(
    id_monitorado
  );

  if (!monitorado) {
    return res.status(404).json({
      error: "Monitorado não encontrado",
    });
  }

  contato.nome = nome;
  contato.telefone = telefone;
  contato.parentesco = parentesco;
  contato.id_monitorado = id_monitorado;

  await contato.save();

  return res.status(200).json(contato);
};

const deletar = async (req, res) => {

  const { id } = req.params;

  const contato = await ContatoEmergencia.findByPk(id);

  if (!contato) {
    return res.status(404).json({
      error: "Contato de emergência não encontrado",
    });
  }

  await contato.destroy();

  return res.status(204).send();
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
};