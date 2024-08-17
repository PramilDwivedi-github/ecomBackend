const sql = require("sequelize");
const db = new sql("ecom-db", "ecom-db_owner", "Iltseni9ajY7", {
  host: "ep-bitter-brook-a5nbe120.us-east-2.aws.neon.tech",
  dialect: "postgres",
  driver: "tedious",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  port: 5432,
  // pool: {
  //   max: 5,
  //   min: 0,
  //   idle: 10000,
  // },
});
// const db = new sql("postgres", "admin", "mypassword", {
//   host: "localhost",
//   dialect: "postgres",
//   driver: "tedious",
//   // dialectOptions: {
//   //   ssl: {
//   //     require: true,
//   //     rejectUnauthorized: false,
//   //   },
//   // },
//   port: 5432,
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });
module.exports = db;
