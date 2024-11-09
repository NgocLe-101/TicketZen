// Controller detail
const Product = require("../models/product.model");

exports.getDetailPage = async (req, res) => {
  const id = req.params.id;
  const [product, relatedProducts] = await Promise.all([
    Product.getProductById(id),
    Product.getAllProducts(5),
  ]);
  res.render("detail", {
    movie: product,
    relatedMovies: relatedProducts
      .filter((product) => product.id != id)
      .slice(0, 4),
  }); // Render detail page
};
