const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const CuidadorMonitorado = sequelize.define("CuidadorMonitorado", {
  id_cuidador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  id_monitorado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: "cuidadores_monitorados",
  timestamps: true,
  paranoid: true,
});

module.exports = CuidadorMonitorado;