// import express
const express = require("express");
const bodyparser = require("body-parser");
const db = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path")
const fs = require('node:fs');
const os = require("os")


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
dotenv.config()

const userRouter = require("./controller/userController");
const sellerRouter = require("./controller/sellerController");
const buyerRouter = require("./controller/buyerController");
const productRouter = require("./controller/productController");
const fileStoreController = require("./controller/fileStoreController");
// cors issue
const whitelist = [
  "http://localhost:3000",
  "https://master--chic-yeot-0b2714.netlify.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

//body parser middleware
app.use(bodyparser.json())


app.use("/seller", sellerRouter);
app.use("/buyer",buyerRouter);
app.use("/product",productRouter);


app.use('/filestore',fileStoreController);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode).send({ message: error.message , errors: error.errors });
});

// const port = 3000;

db.sync()
  .then((res) => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("app runnning!");
    });
  })
  .catch((err) => console.log(err));
