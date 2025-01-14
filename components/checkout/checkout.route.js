import express from 'express';
const router = express.Router();
import checkoutController from './checkout.controller.js';
router.get('/checkout', checkoutController.getCheckout)
router.get('/thankyou', checkoutController.getThankyou)
router.post('/checkout/order', checkoutController.postCreateOrder);
router.post('/checkout/payment-success', checkoutController.postPaymentSuccess);

export default router;