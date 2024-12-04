import knex from "../knexfile.js";

// Tạo đơn hàng từ giỏ hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ID người dùng hiện tại
    const cartItems = await knex("cart_items").where("user_id", userId);

    if (cartItems.length === 0) {
      return res.status(400).send("Giỏ hàng trống.");
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

    // Tạo đơn hàng
    const [orderId] = await knex("orders").insert({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Chuyển các mục trong giỏ hàng thành các mục trong đơn hàng
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      movie_id: item.movie_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await knex("order_items").insert(orderItems);

    // Xóa giỏ hàng
    await knex("cart_items").where("user_id", userId).del();

    res.redirect(`/orders/${orderId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi tạo đơn hàng.");
  }
};

// Lấy thông tin một đơn hàng
export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await knex("orders").where("id", orderId).first();
    if (!order) {
      return res.status(404).send("Đơn hàng không tồn tại.");
    }

    const orderItems = await knex("order_items")
      .join("products", "order_items.movie_id", "products.id")
      .select("products.image_url", "products.title", "order_items.quantity", "order_items.price")
      .where("order_items.order_id", orderId);

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

    const orders = await knex("orders").where("user_id", userId);

    res.render("orders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi lấy danh sách đơn hàng.");
  }
};
