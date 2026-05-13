const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Cuidador = sequelize.define("Cuidador", {
  id_cuidador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },

  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: "cuidadores",
  timestamps: true,
  paranoid: true,
});


module.exports = Cuidador;
