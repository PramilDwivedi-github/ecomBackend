// import express
const express = require("express");
const bodyparser = require("body-parser");
const db = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");

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
// cors issue
const whitelist = ["http://localhost:3000"];
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
app.use(bodyparser.json({ limit: "15360mb" }));

dotenv.config();

app.use("/seller", sellerRouter);
app.use("/buyer", buyerRouter);
app.use("/product", productRouter);

app.use((error, req, res, next) => {
  console.log(error);
  res.send({ message: error.message });
});

// const port = 3000;

db.sync()
  .then((res) => {
    app.listen(process.env.PORT, () => {
      console.log("app runnning!");
      console.log(process.env.tokenKey);
    });
  })
  .catch((err) => console.log(err));
