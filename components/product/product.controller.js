import ProductModel from "./product.model.js";

const getProductPage = async (req, res) => {
  const limit = 8;
  const products = await ProductModel.getAllProducts(limit);
  res.render("product", {
    movies: products.slice(0, limit),
    romanceMovies: products.slice(0, limit),
    scifiMovies: products.slice(0, limit),
  }); // Render product page
};

export default { getProductPage };
