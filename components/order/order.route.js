import express from "express";
import { createOrder, getOrder, listOrders } from "./order.controller.js";

const router = express.Router();

// Tạo đơn hàng từ giỏ hàng
router.post("/create", createOrder);

// Lấy thông tin chi tiết của một đơn hàng
router.get("/:id", getOrder);

// Lấy danh sách đơn hàng của người dùng
router.get("/", listOrders);

export default router;