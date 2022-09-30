const express = require("express");
const { authenticateToken } = require("../services/authService");
const {
  registerBuyer,
  loginBuyer,
  getBuyer,
  addCartItem,
  mycart,
  removeCartItem,
  placeOrder,
  myorders,
  addProfileImg,
  verifyEmail,
  resetPasswod,
} = require("../services/buyerService");

const buyerRouter = express.Router();

buyerRouter.post("/api/register", registerBuyer);
buyerRouter.post("/api/login", loginBuyer);

buyerRouter.post("/api/verifyEmail", verifyEmail);
buyerRouter.post("/api/resetPassword", resetPasswod);

buyerRouter.use(authenticateToken);

buyerRouter.get("/api/data", getBuyer);
buyerRouter.post("/api/addCartItem", addCartItem);
buyerRouter.get("/api/mycart", mycart);
buyerRouter.delete("/api/removeCartItem", removeCartItem);

buyerRouter.post("/api/placeOrder", placeOrder);
buyerRouter.get("/api/myorders", myorders);
buyerRouter.post("/api/profileImage", addProfileImg);
module.exports = buyerRouter;
