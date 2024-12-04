import knex from "../knexfile.js";
import orderModel from './order.model';
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await orderModel.findCartItemsByUserId(userId);

    if (cartItems.length === 0) {
      return res.status(400).send("Giỏ hàng trống.");
    }

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
    );

    const orderId = await orderModel.createOrder(userId, totalAmount);

    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      movie_id: item.movie_id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Thêm mục đơn hàng vào DB
    await orderModel.createOrderItems(orderItems);

    // Xóa giỏ hàng của user
    await orderModel.clearCart(userId);

    // Chuyển hướng đến chi tiết đơn hàng
    res.redirect(`/orders/${orderId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi tạo đơn hàng.");
  }
};


export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Lấy thông tin đơn hàng từ model
    const order = await orderModel.findOrderById(orderId);

    if (!order) {
      return res.status(404).send("Đơn hàng không tồn tại.");
    }

    // Lấy danh sách mục trong đơn hàng từ model
    const orderItems = await orderModel.findOrderItemsByOrderId(orderId);

    // Render thông tin đơn hàng và các mục
    res.render("order", { order, orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi lấy thông tin đơn hàng.");
  }
};


// Hiển thị danh sách đơn hàng
export const listOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy danh sách đơn hàng từ model
    const orders = await orderModel.findOrdersByUserId(userId);

    // Render danh sách đơn hàng
    res.render("orders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi lấy danh sách đơn hàng.");
  }
};
