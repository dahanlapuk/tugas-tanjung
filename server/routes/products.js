import express from 'express';
import { body } from 'express-validator';
import {
    getProducts,
    getProduct,
    getProductBySKU,
    getBestDeal,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const productValidation = [
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('sku').notEmpty().withMessage('SKU is required'),
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stock').isNumeric().withMessage('Stock must be a number')
];

// Public routes
router.get('/', getProducts);
router.get('/best-deal', getBestDeal);
router.get('/sku/:sku', getProductBySKU);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Admin routes
router.post('/', protect, admin, productValidation, validate, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
