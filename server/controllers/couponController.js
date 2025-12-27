import { Coupon } from '../models/index.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.findAll({
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }

        const coupon = await Coupon.findOne({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Coupon is not valid or has expired'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                code: coupon.code,
                credit: coupon.credit,
                name: coupon.name
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByPk(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        await coupon.update(req.body);

        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByPk(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        await coupon.destroy();

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
