import db from "../../dbs/db.js";

class SeatModel {
    async getSeatsByScreenId(screen_id) {
        try {

            console.log('screen_id:', screen_id); // Debugging
            const result = await db.raw(`SELECT * FROM seats WHERE screen_id = ? ORDER BY id`, [screen_id]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching seats:', error);
            throw error; // Rethrow error if something goes wrong
        }
    }


}

export default new SeatModel();
