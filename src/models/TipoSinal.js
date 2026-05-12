const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const TipoSinal = sequelize.define(
  "TipoSinal",
  {
    id_tipo_sinal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "tipos_sinais",
    timestamps: true,
    paranoid: true,
  },
);
module.exports = TipoSinal;