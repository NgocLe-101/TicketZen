const { randomInt } = require("crypto");
const ProductModel = require("../models/product.model");
const PromotionModel = require("../models/promotion.model");

// Controller index
exports.getIndexPage = async (req, res) => {
  const [products, promotions] = await Promise.all([
    ProductModel.getAllProducts(),
    PromotionModel.getAllPromotions(),
  ]);
  const tabs = [
    {
      name: "Hot New Release",
      movies: products
          .slice(0, 4)
          .map((product) => ({ ...product, tag: "NEW" })),
    },
    {
      name: "Best Seller",
      movies: products
          .slice(4, 8)
          .map((product) => ({ ...product, tag: "HOT" })),
    },
    {
      name: "Top Rated",
      movies: products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4)
          .map((product) => ({ ...product, tag: "TOP" })),
    },
  ];
  const slideShow = products.slice(0, 4);
  res.render("index", { tabs, slideShow, promotions }); // Render index page
};