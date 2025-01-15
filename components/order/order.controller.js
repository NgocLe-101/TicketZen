import orderModel from './order.model.js';
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { seats, totalAmount, movie_id } = req.body;

    // Kiểm tra xem seats có phải là mảng không và có chứa phần tử không
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).send("No seats selected or invalid seats data.");
    }

// Create a new order in the database
    const orderId = await orderModel.createOrder(userId, totalAmount);

// Create order items from the seats data
    const orderItems = seats.map((seat) => ({
      order_id: orderId.id, // Make sure orderId is passed as a number, not an object
      price: parseFloat(seat.price),
      seat_id: parseInt(seat.seatId, 10),
      seat_type: parseInt(seat.seatType, 10),
      movie_id: movie_id
    }));

// Debugging output
    console.log(orderItems[0]);

// Insert the order items into the database
    await orderModel.createOrderItems(orderItems);

    req.session.order_id = orderItems[0].order_id;
    // Sau khi tạo đơn hàng thành công, gửi thông tin về đơn hàng
    res.json({ success: true, orderId: orderId.id });
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
    console.log(order)
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
