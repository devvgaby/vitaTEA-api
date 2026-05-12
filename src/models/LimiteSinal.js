const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const LimiteSinal = sequelize.define("LimiteSinal", {
    id_limite_sinal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_tipo_sinal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_monitorado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    valor_min: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: false,
    },
    valor_max: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: false,
    },
}, {
    tableName: "limites_sinais",
    timestamps: true,
    paranoid: true,
});