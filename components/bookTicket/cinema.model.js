import db from "../../dbs/db.js";

class CinemaModel {
    async getCinemaById(id) {
        try {

            const result = await db.raw('SELECT * FROM cinemas WHERE id = ?', [id]);

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

}

export default new CinemaModel();
