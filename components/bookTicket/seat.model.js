import db from "../../dbs/db.js";

class SeatModel {
    async getSeatsByScreenId(screen_id) {
        try {
            // Using parameterized query to prevent SQL injection
            const result = await db.raw(`SELECT * FROM seats WHERE screen_id = ? ORDER BY id`, [screen_id]);
            return result.rows;
        } catch (error) {
            throw error; // Rethrow error if something goes wrong
        }
    }
}

export default new SeatModel();
