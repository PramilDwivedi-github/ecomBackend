const express = require("express")
const { authenticateToken } = require("../services/authService");
const { createFile } = require("../services/fileStoreService");
const upload = require("../multer");




const fileStoreController = express.Router();


fileStoreController.use(authenticateToken);

fileStoreController.post("/api/upload",upload.single('productImage'),createFile);


module.exports = fileStoreController;