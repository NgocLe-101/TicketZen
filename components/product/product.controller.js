import ProductModel from "./product.model.js";

const getProductPage = async (req, res) => {
  const { page } = req.query;
  const limit = 4;
  const skip = (page - 1) * limit;
  const { products, total } = await ProductModel.getAllProducts(skip, limit);
  const currentPage = parseInt(page) || 1;
  const totalPages = Math.ceil(total / limit);
  res.render("product", {
    movies: products,
    currentPage,
    totalPages,
    limit,
  }); // Render product page
};

const getProducts = async (req, res) => {
  const { page, limit, genre } = req.query;
  const skip = (page - 1) * limit;
  if (genre) {
    const { products, total } = await ProductModel.getProductsByGenre(
      genre,
      skip,
      limit
    );
    return res.status(200).json({ products, total, limit });
  }
  const { products, total } = await ProductModel.getAllProducts(skip, limit);
  res.status(200).json({ products, total, limit });
};

export default { getProductPage, getProducts };
