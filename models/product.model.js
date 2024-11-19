const db = require("../dbs/db");

class ProductModel {
    static createProduct = async ({
                                      id,
                                      title,
                                      description,
                                      price,
                                      image_url,
                                  }) => {
        try {
            const [productId] = await db("products").insert({
                id,
                title,
                description,
                price,
                image_url,
            });
            return productId;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static findOne = async (condition) => {
        try {
            return await db("products").where(condition).first();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getProductById = async (id) => {
        try {
            return await db("products").where({ id }).first();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    static getAllProducts = async (limit = null) => {
        try {
            if (limit) {
                return await db("products").select("*").limit(limit);
            }
            return await db("products").select("*");
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // static searchProducts = async (filters = {}) => {
    //     try {
    //         let query = db('products')
    //             .select("products.*", "genres.name as genre_name", "age_rating.name as age_rating_name", "languages.name as language_name")
    //             .join('genres', 'products.genre', '=', 'genres.id')
    //             .join('age_ratings', 'products.age_rating', '=', 'age_rating.id')
    //             .join('languages', 'products.languages', '=', 'languages.id')
    //
    //         console.log(query.toString())
    //         // Áp dụng bộ lọc theo các điều kiện (nếu có)
    //         if (filters.search) {
    //             query = query.where('products.title', 'like', `%${filters.search}%`);
    //         }
    //         if (filters.title) {
    //             query = query.where('products.title', 'like', `%${filters.title}%`);
    //         }
    //         if (filters.description) {
    //             query = query.where('products.description', 'like', `%${filters.description}%`);
    //         }
    //         if (filters.price) {
    //             query = query.where('products.price', '>=', filters.price);
    //         }
    //         if (filters.image_url) {
    //             query = query.where('products.image_url', 'like', `%${filters.image_url}%`);
    //         }
    //         if (filters.genre) {
    //             query = query.where('genres.name', 'like', `%${filters.genre}%`);
    //         }
    //         if (filters.age) {
    //             query = query.where('age_rating.name', 'like', `%${filters.age}%`);
    //         }
    //         if (filters.language) {
    //             query = query.where('languages.name', 'like', `%${filters.language}%`);
    //         }
    //
    //         // Áp dụng bộ lọc limit nếu có
    //         if (filters.limit) {
    //             query = query.limit(filters.limit);
    //         }
    //
    //         // Thực hiện truy vấn và trả về kết quả
    //         const results = await query;
    //         return results;
    //     } catch (error) {
    //         console.error('Error while searching products:', error);  // Thêm thông báo lỗi chi tiết
    //         throw new Error(error.message);  // Trả về lỗi với thông báo chi tiết
    //     }
    // };
    static searchProducts = async (filters = {}) => {
        try {
            let query = db('products')
                .select("products.*", "genres.name as genre_name", "age_ratings.name as age_rating_name", "languages.name as language_name")
                .join('genres', 'products.genre', '=', 'genres.id')
                .join('age_ratings', 'products.age_rating', '=', 'age_ratings.id')
                .join('languages', 'products.language', '=', 'languages.id');

            console.log(filters.genre)
            // Kiểm tra các giá trị trong filters và áp dụng bộ lọc tương ứng
            if (filters.search) {
                query = query.where('products.title', 'like', `%${filters.search}%`);
            }

            if (filters.title) {
                query = query.where('products.title', 'like', `%${filters.title}%`);
            }

            if (filters.description) {
                query = query.where('products.description', 'like', `%${filters.description}%`);
            }

            if (filters.price) {
                query = query.where('products.price', '>=', filters.price);
            }

            if (filters.image_url) {
                query = query.where('products.image_url', 'like', `%${filters.image_url}%`);
            }

            // Áp dụng bộ lọc cho genre nếu không phải là 'all'
            if (filters.genre && filters.genre !== 'all') {
                query = query.where('genres.name', 'like', `%${filters.genre}%`);
            }

            // Áp dụng bộ lọc cho age_rating nếu không phải là 'all'
            if (filters.age && filters.age !== 'all') {
                query = query.where('age_ratings.name', 'like', `%${filters.age}%`);
            }

            // Áp dụng bộ lọc cho language nếu không phải là 'all'
            if (filters.language && filters.language !== 'all') {
                query = query.where('languages.name', 'like', `%${filters.language}%`);
            }

            // Áp dụng limit nếu có
            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            // Thực hiện truy vấn và trả về kết quả
            const results = await query;
            return results;

        } catch (error) {
            console.error('Error while searching products:', error);  // Thêm thông báo lỗi chi tiết
            throw new Error(error.message);  // Trả về lỗi với thông báo chi tiết
        }
    };



}

module.exports = ProductModel;