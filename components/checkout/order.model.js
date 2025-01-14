import db from "../../dbs/db.js";

class orderModel {
    async getOrder(id){
        try{
            const result = await db.raw(`SELECT id, user_id, total_amount FROM orders where id =?`, [id])
            return result.rows
        } catch (error) {
            throw error;
        }
    }
}

export default new orderModel();