import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
import qs from "qs";
// Info:
/*
Số thẻ	4111 1111 1111 1111
Tên	NGUYEN VAN A
Ngày hết hạn	01/25
Mã CVV	123
 */
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
const url = "localhost:3000";
class zaloController {
  async processingPayment(req, res) {
    const orderDetails = req.body;
    console.log(orderDetails);
    const { order_id, email, totalAmount, status } = orderDetails;
    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
      redirecturl: `${url}/thankyou?order_id=${order_id}&email=${email}&totalAmount=${totalAmount}`,
    };
    // item thông tin
    const items = [];

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${order_id}`,
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: totalAmount,
      //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
      //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
      description: `Ticketzen - Payment for the order #${order_id}`,
      bank_code: "",
      callback_url: "${url}/callback",
    };
    // &amount=500000&appid=2554&apptransid=250114_890&bankcode=CC&checksum=1311427b300a75ea61c3b560df158a7ae47727a7de83d4c745138197081cfe8f&discountamount=0&pmcid=36&status=1
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    console.log("mac = ", order.mac);
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log(result.data);
      return res.json(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  async callBack(req, res) {
    let result = req.body;
    console.log(req.body);
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng ở đây
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log(
          "update order's status = success where app_trans_id =",
          dataJson["app_trans_id"]
        );

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      console.log("lỗi:::" + ex.message);
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
  }
  async checkOrderStatus(req, res) {
    const { app_trans_id } = req.params;

    let postData = {
      app_id: config.app_id,
      app_trans_id, // Input your app_trans_id
    };

    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
      method: "post",
      url: "https://sb-openapi.zalopay.vn/v2/query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };

    try {
      const result = await axios(postConfig);
      console.log(result.data);
      return res.status(200).json(result.data);
      /**
             * kết quả mẫu
             {
             "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
             "return_message": "",
             "sub_return_code": 1,
             "sub_return_message": "",
             "is_processing": false,
             "amount": 50000,
             "zp_trans_id": 240331000000175,
             "server_time": 1711857138483,
             "discount_amount": 0
             }
             */
    } catch (error) {
      console.log("lỗi");
      console.log(error);
    }
  }
}

export default new zaloController();
