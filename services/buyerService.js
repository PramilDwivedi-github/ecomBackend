const { response } = require("express");
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
} = require("../models");
const { generateToken } = require("../services/authService");

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
    res.status(200).send({ message: "success", data });
  } catch (e) {
    e.message = "Unable to fetch data right now";
    next(e);
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
      CartItem.update(
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
      let citem = { item_id: c.item_id, copies: c.copies, detail: p };
      value += c.copies * p.price;
      products.push(citem);
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
        order_item.cost = item.copies * product.price;
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
};
