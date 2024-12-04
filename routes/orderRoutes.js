const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route tạo đơn hàng
router.post("/create", orderController.createOrder);

// Route xem chi tiết đơn hàng
router.get("/:id", orderController.getOrderPage);

// Route xem danh sách đơn hàng
router.get("/", orderController.getAllOrdersPage);

module.exports = router;
