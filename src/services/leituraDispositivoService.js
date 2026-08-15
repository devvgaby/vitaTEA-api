const { LeituraDispositivo, Dispositivo } = require('../models');
const { avaliarLeitura } = require('./alertaService');

// Cria a leitura, atualiza o "heartbeat" de conexão do dispositivo (RN15)
// e avalia se ela dispara um alerta (RN07/RF10/RF11).
const criarLeituraDispositivo = async (id_dispositivo, id_tipo_sinal, valor, data_hora) => {
    const leitura = await LeituraDispositivo.create({
        id_dispositivo,
        id_tipo_sinal,
        valor,
        data_hora
    });

    await Dispositivo.update(
        { ultima_conexao: leitura.data_hora },
        { where: { id_dispositivo } },
    );

    const alerta = await avaliarLeitura(leitura);

    return { leitura, alerta };
}

const listarLeiturasDispositivos = async () => {
    return await LeituraDispositivo.findAll();
}

const buscarLeituraDispositivoPorId = async (id_leitura_dispositivo) => {
    return await LeituraDispositivo.findByPk(id_leitura_dispositivo);
}

const buscarLeiturasDispositivoPorDispositivo = async (id_dispositivo) => {
    return await LeituraDispositivo.findAll({
        where: {
            id_dispositivo
        },
        order: [['data_hora', 'DESC']],
    });
}

const atualizarLeituraDispositivoPorId = async (id_leitura_dispositivo, dados) => {
    const leitura = await LeituraDispositivo.findByPk(id_leitura_dispositivo);
    if (!leitura) return null;

    await leitura.update(dados);
    return leitura;
}

const deletarLeituraDispositivoPorId = async (id_leitura_dispositivo) => {
    const leitura = await LeituraDispositivo.findByPk(id_leitura_dispositivo);
    if (!leitura) return null;

    await leitura.destroy();
    return true;
}

module.exports = {
    criarLeituraDispositivo,
    listarLeiturasDispositivos,
    buscarLeituraDispositivoPorId,
    buscarLeiturasDispositivoPorDispositivo,
    atualizarLeituraDispositivoPorId,
    deletarLeituraDispositivoPorId,
};