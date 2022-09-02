const seq = require("sequelize");

// const db  = new seq("postgres","postgres","Pramil@123",{
//     host:"localhost",
//     dialect:"postgres",
//     port:5432
// })

const db = new seq(
  "d7pgf35kdo9sps",
  "gmdpwkiykpkfaw",
  "786d3bac3d459d85f615f8560a6f5c02f359876c2ee0247b22a06465c9979d0b",
  {
    host: "ec2-107-22-245-82.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
  }
);
module.exports = db;
