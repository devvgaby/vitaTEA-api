const { Sequelize } = require("sequelize");
const config = require("./config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = dbConfig.storage
  ? new Sequelize({
      dialect: "sqlite",
      storage: dbConfig.storage,
      logging: dbConfig.logging,
    })
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: false,
    });

module.exports = sequelize;
