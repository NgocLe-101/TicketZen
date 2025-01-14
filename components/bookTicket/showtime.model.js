import db from "../../dbs/db.js";

class ShowtimeModel {
    async getShowTimeByMovieId(id) {
        try {
            // Using parameterized query to safely insert 'id'
            const result = await db.raw('SELECT * FROM showtimes WHERE movie_id = ?', [id]);
            return result.rows;
        } catch (err) {
            throw err;
        }
    }
}

export default new ShowtimeModel();
