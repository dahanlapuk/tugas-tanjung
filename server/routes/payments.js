import express from 'express';
import { body } from 'express-validator';
import {
    getPayments,
    getPaymentByOrder,
    uploadPayment,
    confirmPayment,
    rejectPayment
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const paymentValidation = [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('paymentPrice').isNumeric().withMessage('Payment price must be a number')
];

// Routes
router.get('/', protect, getPayments);
router.get('/order/:orderId', protect, getPaymentByOrder);
router.post('/', protect, upload.single('paymentProof'), paymentValidation, validate, uploadPayment);
router.put('/:id/confirm', protect, admin, confirmPayment);
router.put('/:id/reject', protect, admin, rejectPayment);

export default router;
