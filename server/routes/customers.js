import express from 'express';
import {
    getProfile,
    updateProfile,
    getCustomers
} from '../controllers/customerController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Customer routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);

// Admin routes
router.get('/', protect, admin, getCustomers);

export default router;
