'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cuidadores_monitorados', {

      id_cuidador: {
        type: Sequelize.INTEGER,
        primaryKey: true,

        references: {
          model: 'cuidadores',
          key: 'id_cuidador',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      id_monitorado: {
        type: Sequelize.INTEGER,
        primaryKey: true,

        references: {
          model: 'monitorados',
          key: 'id_monitorado',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('cuidadores_monitorados');
  }
};