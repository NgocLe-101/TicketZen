import router from "../payment/zalo.route.js";
import orderModel from "./order.model.js";
import userModel from "../user/user.model.js";
import zaloController from "../payment/zalo.controller.js";
class checkoutController {
  async getCheckout(req, res) {
    const order_id = req.session.order_id
    const order = await orderModel.getOrder(order_id);
    console.log(order);
    const user = await userModel.getUser(order.user_id);
    const info = {
      order_id: order.id,
      email: user.email,
      totalAmount: order.total_amount,
      status: order.status,
    };
    return res.render("checkout", { info });
  }
  static async checkOrderStatus(app_trans_id) {
    try {
      const baseURL = process.env.SERVER_URL || "https://57d4-2402-800-6313-61e9-c078-accd-2db8-6d2c.ngrok-free.app";

      const response = await fetch(`${baseURL}/check-status-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ app_trans_id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();        return result;
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  }
  async getThankyou(req, res) {
    const { order_id, email, totalAmount, app_trans_id } = req.query;

    try {
      // Kiểm tra trạng thái thanh toán với app_trans_id
      const statusResponse = await checkoutController.checkOrderStatus(app_trans_id);

      console.log(statusResponse);
      // Kiểm tra kết quả
      const isPaid = statusResponse. return_code === 1

      // Cập nhật trạng thái đơn hàng nếu thanh toán thành công
      if (isPaid) {
        await orderModel.updateStatus(order_id, "paid");
      }
      // Trường hợp thanh toán không thành công
      else await orderModel.updateStatus(order_id, "cancelled");
      const order = await orderModel.getOrder(order_id);
      return res.render("thankyou", {
        order_id,
        email,
        amount: totalAmount,
        status: order.status,
      });
    } catch (error) {
      console.error("Error in getThankyou:", error);
    }
  }
}

export default new checkoutController();
