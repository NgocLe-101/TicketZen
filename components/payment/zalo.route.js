
import express from  'express';
const router  = express.Router();

import zaloController from './zalo.controller.js';
// Route xử lý thanh toán ZaloPay
router.post('/payment', zaloController.processingPayment)
router.post('/callback', zaloController.callBack)
router.post('/check-status-order/:app_trans_id', zaloController.checkOrderStatus)
export default router
