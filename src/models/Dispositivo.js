const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Dispositivo = sequelize.define(
  "Dispositivo",
  {
    id_dispositivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_monitorado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    codigo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "dispositivos",
    timestamps: true,
    paranoid: true,
  },
);

module.exports = Dispositivo;
