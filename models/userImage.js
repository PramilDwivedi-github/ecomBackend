const DataTypes = require("sequelize");
const db = require("../db");

const UserImage = db.define("UserImage", {
  img: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
});

module.exports = UserImage;
