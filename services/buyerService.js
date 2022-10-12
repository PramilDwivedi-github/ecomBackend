const { response } = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const sellerRouter = require("../controller/sellerController");
const {
  Buyer,
  CartItem,
  Product,
  Order,
  OrderItem,
  Sale,
  Seller,
  SaleItem,
  UserImage,
} = require("../models");
const { generateToken } = require("../services/authService");
const { sendEmail } = require("./emailService");

const registerBuyer = async (req, res, next) => {
  try {
    const checkDb = await Buyer.findOne({ where: { email: req.body.email } });

    if (checkDb) res.status(201).send({ message: "Email Already registered" });
    else {
      const newBuyer = await Buyer.create(req.body);
      res
        .status(200)
        .send({ message: "Registered successfuly", data: newBuyer });
    }
  } catch (e) {
    e.message = "unable to reister";
    next(e);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await Buyer.findOne({ where: { email: req.body.email } });
    if (user) res.send({ message: "verified" });
    else res.send({ message: "email not exist" });
  } catch (e) {
    e.message = "unable to verify email";
    next(e);
  }
};

const resetPasswod = async (req, res, next) => {
  try {
    await Buyer.update(
      { password: req.body.password },
      { where: { email: req.body.email } }
    );
    res.send({ message: "password reset successful" });
  } catch (e) {
    e.message = "unable to reset password";
    next(e);
  }
};

const loginBuyer = async (req, res, next) => {
  const data = req.body;

  try {
    const checkBuyer = await Buyer.findOne({
      where: { email: data.email, password: data.password },
    });
    if (checkBuyer) {
      const token = await generateToken({
        id: checkBuyer.id,
        email: checkBuyer.email,
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

const getBuyer = async (req, res, next) => {
  try {
    const data = await Buyer.findOne({ where: { email: req.UserData.email } });
    const img = await data.getUserImage();
    res.status(200).send({ message: "success", data, img });
  } catch (e) {
    e.message = "Unable to fetch data right now";
    next(e);
  }
};

const addProfileImg = async (req, res, next) => {
  try {
    const buyer = await Buyer.findByPk(req.UserData.id);
    const image = await buyer.getUserImage();

    if (image) {
      await UserImage.update(
        { img: req.body.userImage },
        { where: { BuyerId: req.UserData.id } }
      );
      res.send({ message: "Updated" });
    } else {
      const uploadedImage = await UserImage.create({ img: req.body.userImage });
      await uploadedImage.setBuyer(buyer);
      res.send({ message: "Upload Successfull", img: uploadedImage });
    }
  } catch (e) {
    e.message = "unable to add image";
    next();
  }
};

const addCartItem = async (req, res, next) => {
  try {
    const buyer = await Buyer.findByPk(req.UserData.id);

    const cartItems = await buyer.getCartItems();

    const check = cartItems.filter(
      (item) => item.product_id === req.body.product_id
    );

    if (check.length === 1) {
      let updatedCopies =
        check[0].copies + (req.body.copies ? req.body.copies : 1);
      await CartItem.update(
        { copies: updatedCopies },
        { where: { item_id: check[0].item_id } }
      );
      res.status(200).send({ message: "added successfuly" });
    } else {
      const newItem = await CartItem.create({
        product_id: req.body.product_id,
        seller_id: req.body.SellerId,
        copies: req.body.copies,
      });
      await buyer.addCartItem(newItem);
      res.status(200).send({ message: "success", data: newItem });
    }
  } catch (e) {
    console.log(e);
    e.message = "Unable to add right now";
    next(e);
  }
};

const mycart = async (req, res, next) => {
  try {
    const buyer = await Buyer.findByPk(req.UserData.id);
    const cartItems = await buyer.getCartItems();
    const products = [];

    let value = 0;

    for await (let c of cartItems) {
      let p = await Product.findByPk(c.product_id);
      if (p) {
        let citem = { item_id: c.item_id, copies: c.copies, detail: p };
        value += c.copies * p.price;
        products.push(citem);
      }
    }
    res.send({ message: "success", cartItems: products, cartValue: value });
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch cart";
    next(e);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    await CartItem.destroy({ where: { item_id: req.body.item_id } });
    res.send({ message: "Deleted Cart Item" });
  } catch (e) {
    console.log(e);
    e.message = "Unable to fetch cart";
    next(e);
  }
};

const placeOrder = async (req, res, next) => {
  try {
    /////// record order for buyer
    const buyer = await Buyer.findByPk(req.UserData.id);
    const cartItems = await buyer.getCartItems();

    // create a new order and add it to buyer
    const newOrder = await Order.create({ status: "pending" });
    await buyer.addOrder(newOrder);

    // reflect changes and empty buyer's cart

    for await (let cartItem of cartItems) {
      let product = await Product.findByPk(cartItem.product_id);
      product.available = product.available - cartItem.copies;
      await product.save();
    }

    await CartItem.destroy({ where: { BuyerId: req.UserData.id } });

    // add item to orderItem

    const newOrderItems = [];

    for await (let cart_item of cartItems) {
      let newOrderItem = await OrderItem.create({
        product_id: cart_item.product_id,
        seller_id: cart_item.seller_id,
        copies: cart_item.copies,
      });

      newOrderItems.push(newOrderItem);
    }

    await newOrder.addOrderItems(newOrderItems);

    ///////////// record sale for seller

    // create a sale map
    const UniqueSellerIds = new Set();

    newOrderItems.forEach((item) => UniqueSellerIds.add(item.seller_id));

    const saleMap = {};
    UniqueSellerIds.forEach((seller_id) => {
      saleMap[seller_id] = new Array(0);
    });

    newOrderItems.forEach((item) => {
      saleMap[item.seller_id].push(item);
    });

    // creating sale for each sale id in saleMap

    const newSales = [];

    for await (let item of Object.entries(saleMap)) {
      const seller = await Seller.findByPk(item[0]);

      const newSale = await Sale.create({ status: "pending" });

      await seller.addSale(newSale);

      const correspondingSaleItems = [];

      for await (let orderItem of item[1]) {
        const newSaleItem = await SaleItem.create({
          product_id: orderItem.product_id,
          seller_id: item[0],
          copies: orderItem.copies,
        });

        correspondingSaleItems.push(newSaleItem);
      }

      await newSale.addSaleItems(correspondingSaleItems);
      newSales.push(newSale);
    }

    await newOrder.addSales(newSales);

    res.send({ message: "order placed", data: newOrder });

    // sending email to buyer

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const access_token = await oAuth2Client.getAccessToken();

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.email,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: access_token,
      },
    });

    const firstOrderItem = await Product.findByPk(newOrderItems[0].product_id);
    let buyerText = `Greetings from Shopzee ,
    your order of ${firstOrderItem.name} and ${newOrderItems.length - 1}
    more items with orderid ${newOrder.id} is placed successfully. 
    `;

    const buyerEmailDetails = {
      from: process.env.email,
      to: buyer.email,
      subject: "Shopzee Order Placed!!",
      text: buyerText,
    };

    const result = await sendEmail(buyerEmailDetails, mailTransporter);
    if (result !== "success") next(result);

    // sending email to seller
    const sellerEmailDetails = {
      from: process.env.email,
      to: "",
      subject: "New Sale Initiated",
      text: "",
    };

    for await (let item of Object.entries(saleMap)) {
      const firstSaleItem = await Product.findByPk(item[1][0].product_id);
      const seller = await Seller.findByPk(item[0]);
      sellerEmailDetails.to = seller.email;
      let sellerText = `You have new sale of ${firstSaleItem.name} +${
        item[1].length - 1
      } more
      items with saleid ${
        item[1][0].SaleId
      } , please process the order delivery.
      `;
      sellerEmailDetails.text = sellerText;
      let result = await sendEmail(sellerEmailDetails, mailTransporter);
      if (result !== "success")
        next(new Error(`unable to send email to ${seller.email}`));
    }
  } catch (e) {
    console.log(e);
    e.message = "Unable to Palce Order";
    next(e);
  }
};

const myorders = async (req, res, next) => {
  try {
    const userResponse = [];
    const user_orders = await Order.findAll({
      where: { BuyerId: req.UserData.id },
    });

    for await (let order of user_orders) {
      let orderDetail = {
        items: [],
        cost: 0.0,
      };
      orderDetail.order = order;
      let order_items = await order.getOrderItems();

      for await (let item of order_items) {
        let order_item = {};
        let product = await Product.findByPk(item.product_id);
        let seller = await Seller.findByPk(item.seller_id);
        order_item.product = product;
        order_item.seller = {
          email: seller.email,
          phone: seller.phone,
          name: seller.name,
          address: seller.address,
        };
        order_item.copies = item.copies;
        let order_item_cost = item.copies * product.price;
        order_item.cost = order_item_cost;
        orderDetail.cost += order_item.cost;
        orderDetail.items.push(order_item);
      }
      userResponse.push(orderDetail);
    }

    res.status(200).json({ message: "success", orders: userResponse });
  } catch (e) {
    e.message = "unable to find orders";
    next(e);
  }
};

module.exports = {
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
};
