import express from 'express';
import { body } from 'express-validator';
import {
    getContacts,
    getContact,
    sendContact,
    replyContact
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const contactValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required')
];

const replyValidation = [
    body('message').notEmpty().withMessage('Reply message is required')
];

// Public route
router.post('/', contactValidation, validate, sendContact);

// Admin routes
router.get('/', protect, admin, getContacts);
router.get('/:id', protect, admin, getContact);
router.post('/:id/reply', protect, admin, replyValidation, validate, replyContact);

export default router;
