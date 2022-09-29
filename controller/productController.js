const express = require("express");
const {
  getAllProducts,
  getProductById,
  filterProducts,
} = require("../services/productService");

const productRouter = express.Router();

productRouter.get("/api/all", getAllProducts);
productRouter.get("/api/:id", getProductById);
productRouter.post("/api/filter", filterProducts);

module.exports = productRouter;
