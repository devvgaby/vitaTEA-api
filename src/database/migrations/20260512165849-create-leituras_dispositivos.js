'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('leituras_dispositivos', {
      id_leitura_dispositivo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_dispositivo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "dispositivos",
          key: "id_dispositivo",
        },
      },
      id_tipo_sinal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tipos_sinais",
          key: "id_tipo_sinal",
        },
      },
      valor: {
        type: Sequelize.FLOAT,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("leituras_dispositivos");
  }
};
