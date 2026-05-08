const sequelize = require('../database/sequelize');

const db = {};

db.sequelize = sequelize;

db.Cuidador = require('./Cuidador');
db.Monitorado = require('./Monitorado');
db.CuidadorMonitorado = require('./CuidadorMonitorado');
db.ContatoEmergencia = require('./ContatoEmergencia');

// Relacionamentos

// N:N entre Cuidador e Monitorado
db.Cuidador.belongsToMany(db.Monitorado, {
  through: db.CuidadorMonitorado,
  foreignKey: "id_cuidador",
  otherKey: "id_monitorado",
});

db.Monitorado.belongsToMany(db.Cuidador, {
  through: db.CuidadorMonitorado,
  foreignKey: "id_monitorado",
  otherKey: "id_cuidador",
});

// 1:N entre Monitorado e ContatoEmergencia

db.Monitorado.hasMany(db.ContatoEmergencia, {
  foreignKey: "id_monitorado",
});

db.ContatoEmergencia.belongsTo(db.Monitorado, {
  foreignKey: "id_monitorado",
});

module.exports = db;