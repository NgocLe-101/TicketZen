const express = require("express");
const router = express.Router();

// Controller product
exports.getProductPage = (req, res) => {
  res.render("product"); // Render product page
};

module.exports = router;
