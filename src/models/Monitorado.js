const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Monitorado = sequelize.define("Monitorado", {
  id_monitorado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  nivel_tea: {
    type: DataTypes.ENUM("2", "3"),
    allowNull: false,
  },
}, {
  tableName: "monitorados",
  timestamps: true,
  paranoid: true,
});


module.exports = Monitorado;
