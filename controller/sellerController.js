const express = require("express");
const { Seller } = require("../models");
const { authenticateToken } = require("../services/authService");
const {
  registerSeller,
  loginSeller,
  getSeller,
  addProduct,
  myProducts,
  removeProduct,
  updateProduct,
  addProfileImg,
} = require("../services/sellerService");
const upload = require("../multer");

const sellerRouter = express.Router();

sellerRouter.post("/api/register", registerSeller);

sellerRouter.post("/api/login", loginSeller);

sellerRouter.use(authenticateToken);

sellerRouter.get("/api/data", getSeller);

sellerRouter.post("/api/addProduct",upload.array("productImages",5), addProduct);

sellerRouter.get("/api/myProducts", myProducts);
sellerRouter.delete("/api/removeProducts", removeProduct);

sellerRouter.put("/api/updateProduct", updateProduct);
sellerRouter.post("/api/profileImage", addProfileImg);

module.exports = sellerRouter;
