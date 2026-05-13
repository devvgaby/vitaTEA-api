'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alertas', {
      id_alerta: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      id_leitura_dispositivo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'leituras_dispositivos',
          key: 'id_leitura_dispositivo',
        },
      },

      mensagem: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nivel_criticidade: {
        type: Sequelize.ENUM('baixo', 'medio', 'alto', 'critico'),
        allowNull: false,
      },

      data_hora: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alertas');
  },
};