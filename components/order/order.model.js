import db from "../../dbs/db.js";
class OrderModel {
  // Tạo đơn hàng từ giỏ hàng
  async createFromCart(userId) {
    const trx = await db.transaction();

    try {
      // Lấy danh sách sản phẩm trong giỏ hàng
      const cartItems = await trx("cart_items")
          .join("products", "cart_items.product_id", "=", "products.id")
          .where("cart_items.user_id", userId)
          .select(
              "products.id as product_id",
              "products.price",
              "cart_items.quantity"
          );

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Tính tổng tiền
      const totalAmount = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
      );

      // Tạo đơn hàng
      const [orderId] = await trx("orders").insert({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Tạo danh sách mục đơn hàng
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id, // Đảm bảo đúng trường
        quantity: item.quantity,
        price: item.price,
      }));

      await trx("order_items").insert(orderItems);

      // Xóa giỏ hàng của người dùng
      await trx("cart_items").where("user_id", userId).del();

      // Commit transaction
      await trx.commit();

      return {
        id: orderId,
        total_amount: totalAmount,
        items: orderItems,
      };
    } catch (error) {
      await trx.rollback();
      console.error("Error in createFromCart:", error);
      throw error;
    }
  }

  // Tạo đơn hàng mới
  async createOrder(userId, totalAmount) {
    try {
      const orderId = await db("orders").insert({
        user_id: userId,
        total_amount: totalAmount,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return orderId; // Trả về ID của đơn hàng vừa tạo
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  // Thêm mục đơn hàng vào DB
  async createOrderItems(orderItems) {
    try {
      await db("order_items").insert(orderItems); // Chèn danh sách các mục đơn hàng vào DB
    } catch (error) {
      console.error("Error adding order items:", error);
      throw error;
    }
  }

  // Xóa giỏ hàng của user
  async clearCart(userId) {
    return await db("cart_items").where("user_id", userId).del();
  }

  // Lấy thông tin chi tiết đơn hàng
  async getOrderDetails(orderId, userId) {
    const order = await db("orders").where({ id: orderId, user_id: userId }).first();
    if (!order) return null;

    const items = await db("order_items")
        .join("products", "order_items.product_id", "=", "products.id")
        .where("order_items.order_id", orderId)
        .select(
            "products.title",
            "products.image_url",
            "order_items.quantity",
            "order_items.price"
        );

    return {
      ...order,
      items,
    };
  }

  // Lấy danh sách đơn hàng của người dùng
  async getUserOrders(userId) {
    return await db("orders").where("user_id", userId).orderBy("created_at", "desc");
  }

  // Tìm đơn hàng theo orderId
  async findOrderById(orderId) {
    return await db("orders").where("id", orderId).first();
  }

  // Lấy danh sách các mục trong đơn hàng theo orderId
  async findOrderItemsByOrderId(orderId) {
    return await db("order_items")
        .join("products", "order_items.product_id", "products.id") // Ensure the correct field is used for join
        .select(
            "products.image_url",
            "products.title",
            "order_items.quantity",
            "order_items.price"
        )
        .where("order_items.order_id", orderId);
  }

  // Lấy danh sách đơn hàng của người dùng
  async findOrdersByUserId(userId) {
    return await db("orders")
        .where("user_id", userId)
        .orderBy("created_at", "desc");
  }
}

export default new OrderModel();
