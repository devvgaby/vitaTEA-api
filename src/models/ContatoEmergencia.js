const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const ContatoEmergencia = sequelize.define(
  "ContatoEmergencia",
  {
    id_contato_emergencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    id_monitorado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    parentesco: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "contatos_emergencia",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = ContatoEmergencia;
