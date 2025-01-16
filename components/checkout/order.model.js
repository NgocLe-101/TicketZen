import db from "../../dbs/db.js";

class orderModel {
  async getOrder(id) {
    try {
      const result = await db.raw(
        `SELECT id, user_id, total_amount, status FROM orders where id =?`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  async updateStatus(id, status) {
    try {
      const result = await db.raw(`UPDATE orders SET status = ? WHERE id = ?`, [
        status,
        id,
      ]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new orderModel();
