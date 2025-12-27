import { Customer, User } from '../models/index.js';

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            where: { user_id: req.user.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'username', 'profile_picture']
            }]
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phoneNumber, address } = req.body;

        const customer = await Customer.findOne({
            where: { user_id: req.user.id }
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer profile not found'
            });
        }

        // Update customer
        const updateData = {};
        if (name) updateData.name = name;
        if (phoneNumber) updateData.phone_number = phoneNumber;
        if (address) updateData.address = address;
        if (req.file) updateData.profile_picture = req.file.filename;

        await customer.update(updateData);

        // Update user name if provided
        if (name) {
            await User.update({ name }, { where: { id: req.user.id } });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all customers (admin only)
// @route   GET /api/customers
// @access  Private/Admin
export const getCustomers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows } = await Customer.findAndCountAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'username', 'created_at']
            }],
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};
