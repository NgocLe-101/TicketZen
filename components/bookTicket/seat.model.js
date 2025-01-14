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
    async getSeatsByShowtimeId(showtimeId) {
        try {
          const result = await db('seats').where({ screen_id: showtimeId }).select('*');
          return result;
        } catch (error) {
          throw error;
        }
      }
}

export default new SeatModel();
