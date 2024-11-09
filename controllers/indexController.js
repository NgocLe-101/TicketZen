const { randomInt } = require("crypto");
const ProductModel = require("../models/product.model");

// Controller index
exports.getIndexPage = async (req, res) => {
  const products = await ProductModel.getAllProducts();
  const tabs = [
    {
      name: "Hot New Release",
      movies: products.slice(0, 4),
    },
    {
      name: "Best Seller",
      movies: products.slice(4, 8),
    },
    {
      name: "Top Rated",
      movies:
        products.slice(8, 12).length < 4
          ? products.slice(randomInt(4)).slice(0, 4)
          : products.slice(8, 12),
    },
  ];
  res.render("index", { tabs }); // Render index page
};
