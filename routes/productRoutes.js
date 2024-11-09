const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/movies", productController.getProductPage);

module.exports = router;
