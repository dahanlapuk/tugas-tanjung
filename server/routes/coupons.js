import express from 'express';
import { body } from 'express-validator';
import {
    getCoupons,
    validateCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const couponValidation = [
    body('name').notEmpty().withMessage('Coupon name is required'),
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('credit').isNumeric().withMessage('Credit must be a number'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('expiredDate').isISO8601().withMessage('Valid expiry date is required')
];

// Public route
router.post('/validate', validateCoupon);

// Admin routes
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, couponValidation, validate, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
