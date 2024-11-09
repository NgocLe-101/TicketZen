// Controller detail
const express = require("express");
const router = express.Router();

// Controller detail
exports.getDetailPage = (req, res) => {
  res.render("detail"); // Render detail page
};

module.exports = router;
