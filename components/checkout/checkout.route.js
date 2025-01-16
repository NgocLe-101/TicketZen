import express from 'express';
const router = express.Router();
import checkoutController from './checkout.controller.js';
router.get('/checkout', checkoutController.getCheckout)
router.get('/thankyou', checkoutController.getThankyou)


export default router;