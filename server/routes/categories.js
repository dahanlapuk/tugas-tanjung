import express from 'express';
import { body } from 'express-validator';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const categoryValidation = [
    body('name').notEmpty().withMessage('Category name is required')
];

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', protect, admin, categoryValidation, validate, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
