import { th } from "date-fns/locale";
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
    async getShowtimesByMovieIds(movieIds)
    {
        try {
            const result = await db('showtimes').whereIn('movie_id', movieIds).select('*');
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}

export default new ShowtimeModel();
