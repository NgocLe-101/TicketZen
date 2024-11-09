// Controller detail
const Product = require("../models/product.model");

exports.getDetailPage = async (req, res) => {
  const id = req.params.id;
  const [product, relatedProducts] = await Promise.all([
    Product.getProductById(id),
    Product.getAllProducts(4),
  ]);
  res.render("detail", {
    movie: product,
    relatedMovies: relatedProducts.filter((product) => product.id !== id),
  }); // Render detail page
};
