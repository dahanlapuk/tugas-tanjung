import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// Generate order number
const generateOrderNumber = () => {
    const alpha = Math.random().toString(36).substring(2, 5).toUpperCase();
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    const num = Math.floor(Math.random() * 1000);

    return `${alpha}${day}${month}${year}${num}`;
};

// @desc    Get all orders (admin) or user orders (customer)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
    try {
        let query = {};

        // If not admin, only show user's orders
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }

        const { page = 1, limit = 10, status } = req.query;

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .populate('couponId', 'code credit')
            .populate('items.productId', 'name pictureName price')
            .sort('-orderDate')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('couponId', 'code credit')
            .populate('items.productId', 'name pictureName price sku');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user is order owner or admin
        if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const { items, couponCode, deliveryData, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items'
            });
        }

        // Calculate total
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemPrice = product.price - product.currentDiscount;
            totalPrice += itemPrice * item.quantity;

            orderItems.push({
                productId: product._id,
                orderQty: item.quantity,
                orderPrice: itemPrice
            });

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Apply coupon if provided
        let couponId = null;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (coupon && coupon.isValid()) {
                totalPrice -= coupon.credit;
                couponId = coupon._id;
            }
        }

        // Add shipping cost (if applicable)
        const shippingCost = totalPrice >= 1500000 ? 0 : 25000;
        totalPrice += shippingCost;

        // Create order
        const order = await Order.create({
            userId: req.user.id,
            couponId,
            orderNumber: generateOrderNumber(),
            orderStatus: 'pending',
            totalPrice,
            totalItems: items.length,
            paymentMethod: paymentMethod || 1,
            deliveryData,
            items: orderItems
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.orderStatus = status;

        if (status === 'delivered') {
            order.deliveredDate = new Date();
        }

        if (status === 'delivered' || status === 'completed') {
            order.finishDate = new Date();
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};
