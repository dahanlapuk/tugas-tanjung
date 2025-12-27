import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

// @desc    Get all payments (admin) or user's payments (customer)
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res, next) => {
    try {
        let query = {};

        // If not admin, only show user's payments
        if (req.user.role !== 'admin') {
            // Get user's orders first
            const orders = await Order.find({ userId: req.user.id }).select('_id');
            const orderIds = orders.map(order => order._id);
            query.orderId = { $in: orderIds };
        }

        const { page = 1, limit = 10, status } = req.query;

        if (status) {
            query.paymentStatus = status;
        }

        const payments = await Payment.find(query)
            .populate({
                path: 'orderId',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })
            .sort('-paymentDate')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Payment.countDocuments(query);

        res.status(200).json({
            success: true,
            data: payments,
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

// @desc    Get payment by order ID
// @route   GET /api/payments/order/:orderId
// @access  Private
export const getPaymentByOrder = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId })
            .populate({
                path: 'orderId',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check if user owns this payment
        if (payment.orderId.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this payment'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload payment proof
// @route   POST /api/payments
// @access  Private
export const uploadPayment = async (req, res, next) => {
    try {
        const { orderId, paymentPrice, paymentData } = req.body;

        // Check if order exists and belongs to user
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload payment for this order'
            });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ orderId });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment already uploaded for this order'
            });
        }

        const payment = await Payment.create({
            orderId,
            paymentPrice,
            pictureName: req.file ? req.file.filename : null,
            paymentData: paymentData ? JSON.parse(paymentData) : {},
            paymentStatus: 'pending'
        });

        // Update order status
        order.orderStatus = 'confirmed';
        await order.save();

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Confirm payment
// @route   PUT /api/payments/:id/confirm
// @access  Private/Admin
export const confirmPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        payment.paymentStatus = 'confirmed';
        payment.confirmedDate = new Date();
        await payment.save();

        // Update order status
        const order = await Order.findById(payment.orderId);
        if (order) {
            order.orderStatus = 'processing';
            await order.save();
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject payment
// @route   PUT /api/payments/:id/reject
// @access  Private/Admin
export const rejectPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        payment.paymentStatus = 'rejected';
        await payment.save();

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};
