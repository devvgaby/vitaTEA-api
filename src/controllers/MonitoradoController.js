const { Monitorado } = require('../models');

const criar = async (req, res) => { 
    const { nome, idade, nivel_tea } = req.body;

    if (!nome || !idade || !nivel_tea) {
        return res.status(400).json({
            error: "Todos os campos são obrigatórios",
        });
    }

    try {
        const monitorado = await Monitorado.create({
            nome,
            idade,
            nivel_tea,
        });

        return res.status(201).json({
            id_monitorado: monitorado.id_monitorado,
            nome: monitorado.nome,
            idade: monitorado.idade,
            nivel_tea: monitorado.nivel_tea,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Erro ao criar monitorado",
        });
    }
};

const listar = async (req, res) => {
    const monitorados = await Monitorado.findAll();
    return res.status(200).json(monitorados);
};

const buscarPorId = async (req, res) => {
    const { id } = req.params;

    const monitorado = await Monitorado.findByPk(id);

    if (!monitorado) {
        return res.status(404).json({
            error: "Monitorado não encontrado",
        });
    }

    return res.status(200).json(monitorado);
}

const atualizar = async (req, res) => {
    const { id } = req.params;
    const { nome, idade, nivel_tea } = req.body;

    const monitorado = await Monitorado.findByPk(id);

    if (!monitorado) {
        return res.status(404).json({
            error: "Monitorado não encontrado",
        });
    }

    monitorado.nome = nome 
    monitorado.idade = idade 
    monitorado.nivel_tea = nivel_tea 

    await monitorado.save();

    return res.status(200).json(monitorado);

}

const deletar = async (req, res) => {
    const { id } = req.params;

    const monitorado = await Monitorado.findByPk(id);

    if (!monitorado) {
        return res.status(404).json({
            error: "Monitorado não encontrado",
        });
    }

    await monitorado.destroy();

    return res.status(204).send();
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar,
}

 