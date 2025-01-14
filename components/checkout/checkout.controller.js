import router from "../payment/zalo.route.js";
import orderModel from "./order.model.js";
import userModel from "../user/user.model.js";
class checkoutController{
    async getCheckout(req, res){
            // const order_id = req.body
            // const order = orderModel.getOrder(order_id);
            // const user = await userModel.getUser(order.user_id);
            //
            const order = {
                order_id: Math.floor(Math.random() * 1000),
                total_amount: 500000,
                status: "pending"
            }
            const user = {
                email: "jake@gmail.com"
            }
            const info = {
                order_id: order.order_id,
                email: user.email,
                totalAmount: order.total_amount,
                status: order.status,
            }
            return res.render('checkout', {info})
    }
    async getThankyou(req, res) {
        const { order_id, email, totalAmount } = req.query;

        if (!order_id || !email || !totalAmount) {
            return res.status(400).send('Missing required parameters');
        }

        return res.render('thankyou', { order_id, email, amount: totalAmount });
    }

}

export default new checkoutController();