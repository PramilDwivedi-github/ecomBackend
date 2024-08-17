const { body, check } = require("express-validator");
const { validate } = require("../helpers");
const { Buyer } = require("../../models");
const ValidationError = require("../../errors/validationError");


const loginValidations  =  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").isLength({ min: 10 }).withMessage("Password must be atleast 10 characters long")
]


const registerValidations = [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").isLength({ min: 10 }).withMessage("Password must be atleast 10 characters long"),
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("phone").isMobilePhone("en-IN").withMessage("Phone number is invalid!")
]

const validateRemoveCartItem  = async (req,res,next)=>{
    body("item_id").custom(async (value, { req }) => {

        const buyer = await Buyer.findByPk(req.UserData.id);
        const cartItems = await buyer.getCartItems();
        const itemToDelete = cartItems.find(item=> item.item_id === req.body.item_id )
        console.log(itemToDelete)
        if(!itemToDelete)
            throw new ValidationError("Cart Item does not exist!")
      }).withMessage("Item Id is invalid!")         
}


const validateLogin = validate(loginValidations);
const validateRegister = validate(registerValidations);


module.exports = {validateLogin,validateRegister,validateRemoveCartItem};