import router from "../payment/zalo.route.js";
import orderModel from "./order.model.js";
import userModel from "../user/user.model.js";
class checkoutController {
  async getCheckout(req, res) {
    const order_id = req.session.order_id
    const order = await orderModel.getOrder(order_id);
    console.log(order);
    const user = await userModel.getUser(order.user_id);


    // const order = {
    //   order_id: Math.floor(Math.random() * 1000),
    //   total_amount: 500000,
    //   status: "pending",
    // };
    // const user = {
    //   email: "jake@gmail.com",
    // };
    const info = {
      order_id: order.id,
      email: user.email,
      totalAmount: order.total_amount*1000,
      status: order.status,
    };
    return res.render("checkout", { info });
  }
  async getThankyou(req, res) {
    const { order_id, email, totalAmount } = req.query;

    if (orderModel.updateStatus(order_id, "paid")) {
      const order = orderModel.getOrder(order_id);
      return res.render("thankyou", {
        order_id,
        email,
        amount: totalAmount,
        status: order.status,
      });
    } else
      res.render("thankyou", {
        order_id,
        email,
        amount: totalAmount,
        status: "Unpaid",
      });
  }

  // từ các ticket tạo ra order
  async postCreateOrder(req, res) {
    try {
      const { tickets } = req.body;
      const userId = req.user.id;

      const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
      const order = await orderModel.createOrder(userId, totalAmount);
      await orderModel.createTickets(order.id, tickets);

      res.json({ success: true, orderId: order.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async postPaymentSuccess(req, res) {
    try {
      const { orderId } = req.body;

      const success = await orderModel.updateStatus(orderId, 'paid');

      if (success) {
        res.json({ success: true, message: 'Payment successful' });
      } else {
        res.status(400).json({ success: false, message: 'Order update failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new checkoutController();
