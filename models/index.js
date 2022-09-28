const Buyer = require("./buyer");
const CartItem = require("./cartItem");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Product = require("./product");
const Sale = require("./sale");
const SaleItem = require("./SaleItem");
const Seller = require("./Seller");
const UserImage = require("./userImage");

// buyer has many cart items
Buyer.hasMany(CartItem);
CartItem.belongsTo(Buyer);

// Buyer has many Orders

Buyer.hasMany(Order);
Order.belongsTo(Buyer);

// seller has many products

Seller.hasMany(Product);
Product.belongsTo(Seller);

// Order has many orderItems

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

//  Seller has many sales
Seller.hasMany(Sale);
Sale.belongsTo(Seller);

Sale.hasMany(SaleItem);
SaleItem.belongsTo(Sale);

Order.hasMany(Sale);
Sale.belongsTo(Order);

// image

Buyer.hasOne(UserImage);
Seller.hasOne(UserImage);

UserImage.belongsTo(Buyer);
UserImage.belongsTo(Seller);

module.exports = {
  Buyer,
  Seller,
  CartItem,
  Order,
  OrderItem,
  Product,
  Sale,
  SaleItem,
  UserImage,
};
