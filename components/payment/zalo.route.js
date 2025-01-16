
import express from  'express';
const router  = express.Router();

import zaloController from './zalo.controller.js';
// Route xử lý thanh toán ZaloPay
router.post('/payment', zaloController.processingPayment)
router.post('/callback', zaloController.callBack)
router.post('/check-status-order', zaloController.checkOrderStatus)
export default router
