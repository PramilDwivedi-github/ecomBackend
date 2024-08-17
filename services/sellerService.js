const fs = require('fs').promises;
const { Seller, Product, UserImage ,ProductImage } = require("../models");

const jwt = require("jsonwebtoken");
const { generateToken } = require("./authService");
const { createFileInFileStore } = require('./fileStoreService');
const { buckets, getObjectUrl } = require('../Util/Supabase');
const { url } = require('node:inspector');

const registerSeller = async (req, res, next) => {
  try {
    const seller_data = req.body;

    // check if the email is already registered

    const checkDb = await Seller.findOne({
      where: { email: seller_data.email },
    });

    if (checkDb) {
      res.status(201).send({ message: "Email Already Registered" });
    } else {
      const createdSeller = await Seller.create(seller_data);
      res
        .status(200)
        .send({ message: "User Registered Successfully", data: createdSeller });
    }
  } catch (e) {
    e.message = "Some Excetion Occured";
    next(e);
  }
};

const loginSeller = async (req, res, next) => {
  const data = req.body;

  try {
    const checkSeller = await Seller.findOne({
      where: { email: data.email, password: data.password },
    });
    if (checkSeller) {
      const token = await generateToken({
        id: checkSeller.id,
        email: checkSeller.email,
      });
      res.status(200).send({ message: "logged in successfuly", token });
    } else {
      res.status(400).send({ message: "invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    e.message = "Unable to login please try after sometime";
    next(e);
  }
};

const getSeller = async (req, res, next) => {
  try {
    const data = await Seller.findOne({ where: { email: req.UserData.email } });
    const img = await data.getUserImage();
    res.status(200).send({ message: "success", data, img });
  } catch (e) {
    e.message = "Unable to fetch data right now";
    next(e);
  }
};

const addProfileImg = async (req, res, next) => {
  try {
    const seller = await Seller.findByPk(req.UserData.id);
    const image = await seller.getUserImage();

    if (image) {
      await UserImage.update(
        { img: req.body.userImage },
        { where: { SellerId: req.UserData.id } }
      );
      res.send({ message: "Updated" });
    } else {
      const uploadedImage = await UserImage.create({ img: req.body.userImage });
      await uploadedImage.setSeller(seller);
      res.send({ message: "Upload Successfull", img: uploadedImage });
    }
  } catch (e) {
    e.message = "unable to add image";
    next();
  }
};

const addProduct = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({
      where: { email: req.UserData.email },
    });
    console.log(req.body,req.files)
    // create product 
    const newProduct = await Product.create(req.body);

    // upload images
    const productImages = [];
    const imageUploadErrors = [];
    if(req.files){
      for await (let img of req.files){
        try{
          const fileData = await fs.readFile(img.path);

          const response = await createFileInFileStore(buckets.productImage, img.filename,fileData);

          if(response && response.error) imageUploadErrors.push({filename:img.filename,error:response.error});
          else if(response && response.data){
            // create productImage object
            const imageObject = await ProductImage.create({img_url:getObjectUrl(response.data.fullPath)});
            productImages.push(imageObject);
          }
        
        }
        catch(fileReadError){
          imageUploadErrors.push({filename:img.filename,error:fileReadError});
        }
      }
    }
    // save product
    await newProduct.addProductImages(productImages);
    await seller.addProduct(newProduct);
    res.status(200).send({ message: "product added successfully", product:newProduct });
  } catch (e) {
    e.message = "unable to add product";
    console.log(e);
    next(e);
  }
};

// const authenticateToken = async (req, res, next) => {
//   try {
//     var token = req.headers.authorization.split(" ")[1];
//     jwt.verify(token, process.env.tokenKey, (err, data) => {
//       if (err) {
//         res.status(400).send({ message: "Invalid Token" });
//       } else {
//         // res.status(200).send({ message: "success", data });
//         req.UserData = data;
//         next();
//       }
//     });
//   } catch (e) {
//     e.message = "Unable to verify token";
//   }
// };

const myProducts = async (req, res, next) => {
  try {
    const seller = await Seller.findByPk(req.UserData.id);
    const products = await seller.getProducts();

    const sellerProducts = [];

    for await (let product of products){
      const productImages = await product.getProductImages();
      sellerProducts.push({...product.dataValues,productImages:[...productImages]})
    }

    console.log(sellerProducts)
    res.status(200).send({ message: "success", products:sellerProducts});
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch products";
    next(e);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const seller = await Seller.findByPk(req.UserData.id);
    const productId = req.body.product_id;

    // const productFromDb = await Product.findByPk(productId);
    // await seller.removeProduct(productFromDb);
    await Product.destroy({ where: { product_id: productId } });
    res.status(200).send({ message: "Removed SuccessFuly" });
  } catch (e) {
    console.log(e);
    e.message = "Unable to Delete product";
    next(e);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.body.product_id;
    const updates = req.body.updates;

    const product = await Product.findByPk(productId);

    const updatedRows = await Product.update(
      {
        name: updates.name ? updates.name : product.name,
        category: updates.category ? updates.category : product.category,
        price: updates.price ? updates.price : product.price,
        available: updates.available ? updates.available : product.available,
        img: updates.img ? updates.img : product.img,
      },
      { where: { product_id: productId } }
    );

    res.send(updatedRows);
  } catch (e) {
    e.message = "unable to update";
    next(e);
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  getSeller,
  addProduct,
  myProducts,
  removeProduct,
  updateProduct,
  addProfileImg,
};
