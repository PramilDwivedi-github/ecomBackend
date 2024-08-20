const { Product } = require("../models");
const { Op } = require("sequelize");

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();

  const allProducts = [];

    for await (let product of products){
      const productImages = await product.getProductImages();
      allProducts.push({...product.dataValues,productImages:[...productImages]})
    }

    res.status(200).send({ message: "success", products:allProducts});
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch produts";
    next(e);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    const productImages = await product.getProductImages();
    res.status(200).send({ message: "success", product:{...product.dataValues,productImages:productImages} });
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch produt";
    next(e);
  }
};

const filterProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        [Op.and]: {
          price: {
            [Op.gte]: req.body.filter.cost[0],
          },
        },
        [Op.and]: {
          price: {
            [Op.lte]: req.body.filter.cost[1],
          },
        },
        [Op.and]: {
          category: {
            [Op.eq]: req.body.filter.category,
          },
        },
      },
    });
    res.status(200).send({ message: "success", products });
  } catch (e) {
    console.log(e);
    e.message = "Unable to filter produt";
    next(e);
  }
};
module.exports = { getAllProducts, getProductById, filterProducts };
