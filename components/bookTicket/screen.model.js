import db from "../../dbs/db.js";

class screenModel{
    async getScreenById(id) {
        try {
            const result = await db.raw(`SELECT * FROM screens WHERE id = ?`, [id]);

            // Return null if no screen is found
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

}

export default new screenModel();