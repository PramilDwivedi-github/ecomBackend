// const express = require("express")
// const User = require("../models/user")

// const jwt = require("jsonwebtoken")

// // instantiate a new router from express.router class
// const userRouter = express.Router()

// // this router can use for defining end points using HTTP method

// userRouter.get("/user",async (req,res,next)=>{

//     var token = req.headers.authorization.split(" ")[1]
//     jwt.verify(token,process.env.tokenKey,async (err,data)=>{
//         if(err){
//             res.send("token not valid")
//         }
//         else
//         {
//             const userData = await User.findOne({where:{email:data}})
//             res.send(userData)
//         }
//     })
// })


// userRouter.post("/user/register",async (req,res)=>{
//     const userData = req.body
    
//     const newuser = await User.create(userData)
//     res.status(200).send(newuser)

// })

// userRouter.post("/user/login",async (req,res)=>{
//     const userData = req.body
    
//     const userFromDb = await User.findOne({where:{email:userData.email}})

//     // userFromDb ?
    
//     // userFromDb.password == userData.password ? res.send({userFromDb}) : res.send("password does not match")
//     // :
//     // res.send("User Not Exist!!")

//     if(userFromDb){
//         if(userFromDb.password == userData.password){
//             // token bhejna hai
//             const token = jwt.sign(userData.email,process.env.tokenKey)
//             res.send({token})
//         }
//         else{
//             res.send("poassword does not match")
//         }
//     }
//     else{
//         res.send("user does't exist")
//     }


// })







// module.exports = userRouter

