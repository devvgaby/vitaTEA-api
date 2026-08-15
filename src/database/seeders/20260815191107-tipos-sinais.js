'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const agora = new Date();

    await queryInterface.bulkInsert('tipos_sinais', [
      {
        nome: 'Frequência Cardíaca',
        unidade_medida: 'bpm',
        createdAt: agora,
        updatedAt: agora,
      },
      {
        nome: 'Saturação de Oxigênio',
        unidade_medida: '%',
        createdAt: agora,
        updatedAt: agora,
      },
      {
        nome: 'Temperatura Corporal',
        unidade_medida: '°C',
        createdAt: agora,
        updatedAt: agora,
      },
      {
        nome: 'Frequência Respiratória',
        unidade_medida: 'irpm',
        createdAt: agora,
        updatedAt: agora,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tipos_sinais', {
      nome: [
        'Frequência Cardíaca',
        'Saturação de Oxigênio',
        'Temperatura Corporal',
        'Frequência Respiratória',
      ],
    });
  },
};
