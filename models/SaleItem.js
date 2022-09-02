const DataTypes = require("sequelize");
const db = require("../db");

const SaleItem = db.define("SaleItem", {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  copies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

module.exports = SaleItem;
