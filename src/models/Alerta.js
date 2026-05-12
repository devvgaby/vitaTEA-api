const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Alerta = sequelize.define(
  "Alerta",
  {
    id_alerta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_leitura_dispositivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensagem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nivel_criticidade: {
      type: DataTypes.ENUM("baixo", "medio", "alto", "critico"),
      allowNull: false,
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "alertas",
    timestamps: true,
    paranoid: true,
  },
);
