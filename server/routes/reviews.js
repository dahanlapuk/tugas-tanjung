import express from 'express';
import { body } from 'express-validator';
import {
    getReviews,
    createReview,
    updateReview,
    deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const reviewValidation = [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('reviewText').notEmpty().withMessage('Review text is required')
];

// Public routes
router.get('/', getReviews);

// Private routes
router.post('/', protect, reviewValidation, validate, createReview);
router.put('/:id', protect, updateReview);

// Admin routes
router.delete('/:id', protect, admin, deleteReview);

export default router;
