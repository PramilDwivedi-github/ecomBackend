const seq = require("sequelize");

// const db  = new seq("postgres","postgres","Pramil@123",{
//     host:"localhost",
//     dialect:"postgres",
//     port:5432
// })

const db = new seq(
  "d297vcufotbto",
  "gwhhixufputqrm",
  "a8785ae88126a967c04faf661bc2c4c6477db665311e61adc0d2eb84931009af",
  {
    host: "ec2-54-159-175-38.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
  }
);
module.exports = db;
