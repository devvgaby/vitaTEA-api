const sequelize = require('../database/sequelize');

const db = {};

db.sequelize = sequelize;

// Importação dos Modelos
db.Cuidador = require('./Cuidador');
db.Monitorado = require('./Monitorado');
db.CuidadorMonitorado = require('./CuidadorMonitorado');
db.ContatoEmergencia = require('./ContatoEmergencia');
db.Dispositivo = require('./Dispositivo');
db.TipoSinal = require('./TipoSinal');
db.LimiteSinal = require('./LimiteSinal');
db.LeituraDispositivo = require('./LeituraDispositivo');
db.Alerta = require('./Alerta');

// --- RELACIONAMENTOS ---

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
//Um monitorado tem vários contatos de emergencia, mas um contato de emergencia pertence a apenas um monitorado
db.Monitorado.hasMany(db.ContatoEmergencia, {
  foreignKey: "id_monitorado",
});
db.ContatoEmergencia.belongsTo(db.Monitorado, {
  foreignKey: "id_monitorado",
});

// 1:1 entre Monitorado e Dispositivo
// Um monitorado tem um dispositivo, e um dispositivo pertence a apenas um monitorado
db.Monitorado.hasOne(db.Dispositivo, {
  foreignKey: "id_monitorado",
});
db.Dispositivo.belongsTo(db.Monitorado, {
  foreignKey: "id_monitorado",
});

// 1:N entre Monitorado e LimiteSinal
// Um monitorado tem vários limites de sinal, mas um limite de sinal pertence a apenas um monitorado
db.Monitorado.hasMany(db.LimiteSinal, {
  foreignKey: "id_monitorado",
});
db.LimiteSinal.belongsTo(db.Monitorado, {
  foreignKey: "id_monitorado",
});

// 1:N entre TipoSinal e LimiteSinal
// Um tipo de sinal tem vários limites de sinal, mas um limite de sinal pertence a apenas um tipo de sinal
db.TipoSinal.hasMany(db.LimiteSinal, {
  foreignKey: "id_tipo_sinal",
});
db.LimiteSinal.belongsTo(db.TipoSinal, {
  foreignKey: "id_tipo_sinal",
});

// 1:N entre Dispositivo e LeituraDispositivo
// Um dispositivo tem várias leituras, mas uma leitura pertence a apenas um dispositivo
db.Dispositivo.hasMany(db.LeituraDispositivo, {
  foreignKey: "id_dispositivo",
});
db.LeituraDispositivo.belongsTo(db.Dispositivo, {
  foreignKey: "id_dispositivo",
});

// 1:N entre TipoSinal e LeituraDispositivo
// Um tipo de sinal tem várias leituras, mas uma leitura pertence a apenas um tipo de sinal
db.TipoSinal.hasMany(db.LeituraDispositivo, {
  foreignKey: "id_tipo_sinal",
});
db.LeituraDispositivo.belongsTo(db.TipoSinal, {
  foreignKey: "id_tipo_sinal",
});

// 1:N entre LeituraDispositivo e Alerta
// Uma leitura de dispositivo pode gerar vários alertas, mas um alerta pertence a apenas uma leitura de dispositivo
db.LeituraDispositivo.hasMany(db.Alerta, {
  foreignKey: "id_leitura_dispositivo",
});
db.Alerta.belongsTo(db.LeituraDispositivo, {
  foreignKey: "id_leitura_dispositivo",
});

module.exports = db;