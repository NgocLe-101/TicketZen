import orderModel from './order.model.js';
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { seats, totalAmount } = req.body;
    console.log(seats, totalAmount);
    // Kiểm tra xem seats có phải là mảng không và có chứa phần tử không
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).send("No seats selected or invalid seats data.");
    }

    // Tạo đơn hàng mới trong DB
    const orderId = await orderModel.createOrder(userId, totalAmount);

    // Tạo các mục đơn hàng từ dữ liệu ghế
    const orderItems = seats.map((seat) => ({
      order_id: orderId,      // Đảm bảo orderId là một số nguyên hợp lệ
      price: parseFloat(seat.price),  // Đảm bảo giá trị price là số nguyên (parseFloat nếu cần)
      seat_id: parseInt(seat.seatId, 10),  // Đảm bảo seatId là số nguyên
      seat_type: parseInt(seat.seatType, 10)  // Đảm bảo seatType là số nguyên
    }));

// Kiểm tra lại orderItems trước khi gọi createOrderItems
    console.log(orderItems);

// Chèn vào DB
    await orderModel.createOrderItems(orderItems);


    // Thêm các mục đơn hàng vào DB
    await orderModel.createOrderItems(orderItems);

    // Sau khi tạo đơn hàng thành công, gửi thông tin về đơn hàng
    res.json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the order.");
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
