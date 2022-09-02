const express = require("express");
const {
  getAllProducts,
  getProductById,
} = require("../services/productService");

const productRouter = express.Router();

productRouter.get("/api/all", getAllProducts);
productRouter.get("/api/:id", getProductById);

module.exports = productRouter;
