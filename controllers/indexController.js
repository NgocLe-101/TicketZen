const express = require("express");
const router = express.Router();

// Controller index
exports.getIndexPage = (req, res) => {
  res.render("index"); // Render index page
};

module.exports = router;
