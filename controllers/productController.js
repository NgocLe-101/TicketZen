// Controller product
const Product = require("../models/product.model");

exports.getProductPage = async (req, res) => {
  const limit = 8;
  const products = await Product.getAllProducts(limit);
  res.render("product", {
    movies: products.slice(0, limit),
    romanceMovies: products.slice(0, limit),
    scifiMovies: products.slice(0, limit),
  }); // Render product page
};
