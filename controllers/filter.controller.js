// const db = require("../dbs/db"); // Adjust the path to your Knex instance
//
// class FilterController {
//     // Filter products by age rating, genres, and languages
//     async filter(req, res) {
//         try {
//             const { age_rating, genres, languages } = req.query;
//
//             // Start building the query
//             let query = db("products")
//                 .select(
//                     "products.id",
//                     "products.title",
//                     "products.description",
//                     "products.price",
//                     "products.image_url",
//                     "products.trailer",
//                     "genres.name as genre",
//                     "languages.name as language",
//                     "age_ratings.name as age_rating"
//                 )
//                 .join("genres", "products.genre", "genres.id")
//                 .join("languages", "products.language", "languages.id")
//                 .join("age_ratings", "products.age_rating", "age_ratings.id");
//
//             // Apply filters dynamically
//             if (age_rating) {
//                 query = query.where("age_ratings.name", age_rating);
//             }
//
//             if (genres) {
//                 query = query.where("genres.name", genres);
//             }
//
//             if (languages) {
//                 query = query.where("languages.name", languages);
//             }
//
//             // Execute the query
//             const products = await query;
//
//             // Return the filtered results
//             return res.status(200).json({
//                 success: true,
//                 data: products,
//             });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 success: false,
//                 message: "An error occurred while filtering products.",
//             });
//         }
//     }
// }
//
// module.exports = new FilterController();

const db = require("../dbs/db"); // Knex instance

class MovieController {
    async getMovies(req, res) {
        try {
            const { genre } = req.params; // Get genre from route parameters

            // Lấy danh sách thể loại (Genres)
            const genresList = await db("genres").select("id", "name");

            // Tạo query cơ sở dữ liệu cho danh sách phim (Movies)
            let query = db("products") // Assuming your movie table is 'products'
                .select(
                    "products.id",
                    "products.title",
                    "products.description",
                    "products.price",
                    "products.image_url",
                    "genres.name as genre"
                )
                .join("genres", "products.genre", "genres.id"); // Ensure the correct foreign key reference

            // Nếu có genre trong URL, lọc theo thể loại
            if (genre) {
                query = query.where("genres.name", genre);
                console.log('Filtered Query:', query.toString());
            }

            // Thực thi query
            const movies = await query;

            // Trả kết quả về client
            return res.status(200).render("movies", {
                movies,
                genresList,
                selectedGenre: genre || "Action" // Truyền thể loại được chọn
            });
        } catch (error) {
            console.error(error);
            return res.status(500).render("404", {
                message: "An error occurred while fetching movies.",
            });
        }
    }
}

module.exports = MovieController;


module.exports = MovieController;
