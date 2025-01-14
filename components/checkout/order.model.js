import db from "../../dbs/db.js";

class orderModel {
  async getOrder(id) {
    try {
      const result = await db.raw(
        `SELECT id, user_id, total_amount FROM orders where id =?`,
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
  // order: id, user_id, total_amount, status
  async createOrder(userId, totalAmount) {
    try {
      const result = await db("orders")
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          status: "pending",
        })
        .returning("*");
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // ticket: id, showtime_id, seat_id, order_id, price
  async createTickets(orderId, tickets) {
    try {
      const ticketData = tickets.map((ticket) => ({
        showtime_id: ticket.showtime_id,
        seat_id: ticket.seat_id,
        order_id: orderId,
        price: ticket.price,
      }));
      await db("tickets").insert(ticketData);
    } catch (error) {
      throw error;
    }
  }
}

export default new orderModel();
