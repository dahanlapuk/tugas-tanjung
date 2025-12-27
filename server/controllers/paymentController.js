import { Payment, Order, User } from '../models/index.js';

// @desc    Get all payments (admin) or user's payments (customer)
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const where = {};

        // If not admin, only show user's payments
        if (req.user.role !== 'admin') {
            const orders = await Order.findAll({
                where: { user_id: req.user.id },
                attributes: ['id']
            });
            const orderIds = orders.map(order => order.id);
            where.order_id = orderIds;
        }

        if (status) {
            where.payment_status = status;
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Payment.findAndCountAll({
            where,
            include: [{
                model: Order,
                as: 'order',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }]
            }],
            limit: parseInt(limit),
            offset,
            order: [['payment_date', 'DESC']]
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

// @desc    Get payment by order ID
// @route   GET /api/payments/order/:orderId
// @access  Private
export const getPaymentByOrder = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({
            where: { order_id: req.params.orderId },
            include: [{
                model: Order,
                as: 'order',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }]
            }]
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check if user owns this payment
        if (payment.order.user_id !== req.user.id && req.user.role !== 'admin') {
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
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload payment for this order'
            });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ where: { order_id: orderId } });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment already uploaded for this order'
            });
        }

        const payment = await Payment.create({
            order_id: orderId,
            payment_price: paymentPrice,
            picture_name: req.file ? req.file.filename : null,
            payment_data: paymentData ? JSON.parse(paymentData) : {},
            payment_status: 'pending'
        });

        // Update order status
        await order.update({ order_status: 'confirmed' });

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
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        await payment.update({
            payment_status: 'confirmed',
            confirmed_date: new Date()
        });

        // Update order status
        const order = await Order.findByPk(payment.order_id);
        if (order) {
            await order.update({ order_status: 'processing' });
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
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        await payment.update({ payment_status: 'rejected' });

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};
