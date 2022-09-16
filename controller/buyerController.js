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
} = require("../services/buyerService");

const buyerRouter = express.Router();

buyerRouter.post("/api/register", registerBuyer);
buyerRouter.post("/api/login", loginBuyer);

buyerRouter.use(authenticateToken);

buyerRouter.get("/api/data", getBuyer);
buyerRouter.post("/api/addCartItem", addCartItem);
buyerRouter.get("/api/mycart", mycart);
buyerRouter.delete("/api/removeCartItem", removeCartItem);

buyerRouter.post("/api/placeOrder", placeOrder);
buyerRouter.get("/api/myorders", myorders);

module.exports = buyerRouter;
