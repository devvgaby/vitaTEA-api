'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('contatos_emergencia', {
      id_contato_emergencia: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      id_monitorado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'monitorados',
          key: 'id_monitorado',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      telefone: {
        type: Sequelize.STRING,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('contatos_emergencia');
  }
};
