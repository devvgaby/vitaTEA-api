"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("limites_sinais", {
      id_limite_sinal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_monitorado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "monitorados",
          key: "id_monitorado",
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

      valor_min: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      valor_max: {
        type: Sequelize.FLOAT,
        allowNull: false,
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
    await queryInterface.dropTable("limites_sinais");
  },
};
