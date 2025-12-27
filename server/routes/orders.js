import express from 'express';
import { body } from 'express-validator';
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const orderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('deliveryData.customer.name').notEmpty().withMessage('Customer name is required'),
    body('deliveryData.customer.phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('deliveryData.customer.address').notEmpty().withMessage('Address is required')
];

// Routes
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, orderValidation, validate, createOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
