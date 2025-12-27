import { Op } from 'sequelize';
import { User, Customer } from '../models/index.js';
import { sendTokenResponse } from '../utils/jwt.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, email, username, password, phoneNumber, address } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            username,
            password,
            role: 'customer'
        });

        // Create customer profile
        await Customer.create({
            user_id: user.id,
            name: name || username,
            phone_number: phoneNumber,
            address
        });

        // Send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Email atau username sudah terdaftar'
            });
        }
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Find user by username or email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email: username }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Customer,
                as: 'customer'
            }],
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        }

        // Update password (will be hashed by hook)
        user.password = newPassword;
        await user.save();

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};
