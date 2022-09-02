// import express
const express = require("express");
const bodyparser = require("body-parser");
const db = require("./db");
const dotenv = require("dotenv");

// const User = require("./models/user")
const {
  Buyer,
  Seller,
  CartItem,
  Order,
  OrderItem,
  Product,
  Sale,
  SaleItem,
} = require("./models/index");

const app = express();

const userRouter = require("./controller/userController");
const sellerRouter = require("./controller/sellerController");
const buyerRouter = require("./controller/buyerController");
const productRouter = require("./controller/productController");

//body parser middleware
app.use(bodyparser.json());

dotenv.config();

app.use("/seller", sellerRouter);
app.use("/buyer", buyerRouter);
app.use("/product", productRouter);

app.use((error, req, res, next) => {
  res.send(error.message);
});

const port = 3000;

db.sync()
  .then((res) => {
    app.listen(port, () => {
      console.log("app runnning!");
      console.log(process.env.tokenKey);
    });
  })
  .catch((err) => console.log(err));
