import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { Order, OrderItem, Product, User, Coupon } from '../models/index.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const where = {};

        // If not admin, only show user's orders
        if (req.user.role !== 'admin') {
            where.user_id = req.user.id;
        }

        // Filter by status
        if (status) {
            where.order_status = status;
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'picture_name']
                    }]
                }
            ],
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product'
                    }]
                },
                {
                    model: Coupon,
                    as: 'coupon',
                    attributes: ['id', 'code', 'credit']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
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

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const { items, couponCode, deliveryData, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        let totalPrice = 0;
        let totalItems = 0;
        let couponId = null;
        let discount = 0;

        // Validate coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({
                where: { code: couponCode.toUpperCase() }
            });

            if (!coupon || !coupon.isValid()) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired coupon'
                });
            }

            couponId = coupon.id;
            discount = parseFloat(coupon.credit);
        }

        // Validate products and calculate total
        for (const item of items) {
            const product = await Product.findByPk(item.productId);

            if (!product) {
                await t.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemPrice = product.getFinalPrice();
            totalPrice += itemPrice * item.quantity;
            totalItems += item.quantity;
        }

        // Apply discount
        totalPrice -= discount;
        if (totalPrice < 0) totalPrice = 0;

        // Generate order number
        const orderNumber = `ORD${Date.now()}${req.user.id}`;

        // Create order
        const order = await Order.create({
            user_id: req.user.id,
            coupon_id: couponId,
            order_number: orderNumber,
            total_price: totalPrice,
            total_items: totalItems,
            payment_method: paymentMethod || 1,
            delivery_data: deliveryData,
            order_status: 'pending'
        }, { transaction: t });

        // Create order items and update stock
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            const itemPrice = product.getFinalPrice();

            await OrderItem.create({
                order_id: order.id,
                product_id: item.productId,
                order_qty: item.quantity,
                order_price: itemPrice
            }, { transaction: t });

            // Update stock
            await product.update({
                stock: product.stock - item.quantity
            }, { transaction: t });
        }

        await t.commit();

        // Fetch complete order
        const completeOrder = await Order.findByPk(order.id, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        res.status(201).json({
            success: true,
            data: completeOrder
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const updateData = { order_status: status };

        if (status === 'delivered') {
            updateData.delivered_date = new Date();
        }

        if (status === 'delivered' || status === 'cancelled') {
            updateData.finish_date = new Date();
        }

        await order.update(updateData);

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};
