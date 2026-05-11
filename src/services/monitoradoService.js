const { Monitorado } = require('../models');

const criarMonitorado = async (nome, idade, nivel_tea) => {
    const monitorado = await Monitorado.create({
        nome,
        idade,
        nivel_tea
    });

    return {
        id_monitorado: monitorado.id_monitorado,
        nome: monitorado.nome,
        idade: monitorado.idade,
        nivel_tea: monitorado.nivel_tea
    };
};

const listarMonitorados = async () => {
    return await Monitorado.findAll();
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

    return {
        id_monitorado: monitorado.id_monitorado,
        nome: monitorado.nome,
        idade: monitorado.idade,
        nivel_tea: monitorado.nivel_tea
    };
};

const deletarMonitoradoPorId = async (id_monitorado) => {
    const monitorado = await Monitorado.findByPk(id_monitorado);

    if (!monitorado) return null;

    await monitorado.destroy();

    return true;
};

module.exports = {
    criarMonitorado,
    listarMonitorados,
    buscarMonitoradoPorId,
    atualizarMonitoradoPorId,
    deletarMonitoradoPorId
};