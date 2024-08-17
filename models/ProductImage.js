const DataTypes = require("sequelize");
const db = require("../db");

const ProductImage = db.define("ProductImage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  img_url:{
    type: DataTypes.STRING
  }
});

module.exports = ProductImage;
