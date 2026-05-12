  const { DataTypes } = require("sequelize");
  const sequelize = require("../database/sequelize");

  const LeituraDispositivo = sequelize.define(
    "LeituraDispositivo",
    {
      id_leitura_dispositivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_dispositivo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_tipo_sinal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      valor: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      data_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "leituras_dispositivos",
      timestamps: true,
      paranoid: true,
    },
  );
