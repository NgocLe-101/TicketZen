const db = require("../dbs/db");

class OrderModel {
  static createOrder = async ({ customer_name, items }) => {
    try {
      // Create order
      const [orderId] = await db("orders").insert({ customer_name });
      
      // Add order details
      const orderDetails = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
      await db("order_details").insert(orderDetails);

      return orderId;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getOrderById = async (orderId) => {
    try {
      const order = await db("orders").where({ id: orderId }).first();
      const details = await db("order_details")
        .where({ order_id: orderId })
        .join("products", "order_details.product_id", "=", "products.id")
        .select("products.title", "products.image_url", "order_details.quantity", "order_details.price");
      return { order, details };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getAllOrders = async () => {
    try {
      return await db("orders").select("*").orderBy("created_at", "desc");
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = OrderModel;
