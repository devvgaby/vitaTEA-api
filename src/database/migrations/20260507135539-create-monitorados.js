'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('monitorados', {
      id_monitorado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      idade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      nivel_tea: {
        type: Sequelize.ENUM('2', '3'),
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('monitorados');
  },
};