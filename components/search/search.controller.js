import ProductModel from "../product/product.model.js";

const getMovies = async (req, res) => {
  try {
    const { genre, language, age, rate, price, search, limit } = req.query;

    let filters = {
      genre: genre || "all",
      language: language || "all",
      age: age || "all",
      rate: rate || "all",
      price: price || "",
      search: search || "",
      limit: limit || 10, // Default limit
    };

    // Gửi filters qua hàm searchProducts để lấy phim
    let movies = await ProductModel.searchProducts(filters);

    // Trả kết quả cho client
    res.render("filter", { movies, filters });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm dữ liệu", error });
  }
};

const renderMovies = async (req, res) => {
  try {
    let movies = await ProductModel.getAllProducts();
    res.render("filter", { movies: movies.products, filters: {} });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error });
  }
};

export default { getMovies, renderMovies };
