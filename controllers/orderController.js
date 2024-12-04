const OrderModel = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    const { customer_name, items } = req.body; // Expect: { customer_name, items: [{ product_id, quantity, price }] }
    const orderId = await OrderModel.createOrder({ customer_name, items });
    res.redirect(`/orders/${orderId}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOrderPage = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order, details } = await OrderModel.getOrderById(orderId);
    res.render("order", { order, details });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllOrdersPage = async (req, res) => {
  try {
    const orders = await OrderModel.getAllOrders();
    res.render("orders", { orders });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
