const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const ContatoEmergencia = sequelize.define("ContatoEmergencia", {
  id_contato_emergencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  id_monitorado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "contatos_emergencia",
  timestamps: true,
  paranoid: true,
});

module.exports = ContatoEmergencia;
