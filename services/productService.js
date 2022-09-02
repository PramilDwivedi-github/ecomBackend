const { Product } = require("../models");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).send({ message: "success", products });
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch produts";
    next(e);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    res.status(200).send({ message: "success", product });
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch produt";
    next(e);
  }
};
module.exports = { getAllProducts, getProductById };
