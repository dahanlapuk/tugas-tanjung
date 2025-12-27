import Customer from '../models/Customer.js';
import User from '../models/User.js';

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ userId: req.user.id })
            .populate('userId', 'name email username profilePicture');

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

        const customer = await Customer.findOne({ userId: req.user.id });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer profile not found'
            });
        }

        // Update customer
        if (name) customer.name = name;
        if (phoneNumber) customer.phoneNumber = phoneNumber;
        if (address) customer.address = address;

        if (req.file) {
            customer.profilePicture = req.file.filename;
        }

        await customer.save();

        // Update user name if provided
        if (name) {
            await User.findByIdAndUpdate(req.user.id, { name });
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

        const customers = await Customer.find()
            .populate('userId', 'name email username createdAt')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Customer.countDocuments();

        res.status(200).json({
            success: true,
            data: customers,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};
