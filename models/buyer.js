const DataTypes = require("sequelize")
const db = require("../db")



const Buyer = db.define("Buyer",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    },
    name:DataTypes.STRING,
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    address:{
        type:DataTypes.STRING,
        allowNull:false
    }
})  

module.exports = Buyer
