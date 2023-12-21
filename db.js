const sql = require("sequelize");
const db = new sql("postgres", "pdwivedi", "Pramil@2580", {
  host: "pdwivedi-postgress-server.postgres.database.azure.com",
  dialect: "postgres",
  driver: "tedious",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
module.exports = db;
