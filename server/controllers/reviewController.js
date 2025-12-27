import { Review, User, Order } from '../models/index.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows } = await Review.findAndCountAll({
            where: { status: true },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'profile_picture']
                },
                {
                    model: Order,
                    as: 'order',
                    attributes: ['id', 'order_number']
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['review_date', 'DESC']]
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

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
    try {
        const { orderId, title, reviewText } = req.body;

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
                message: 'Not authorized to review this order'
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            where: {
                order_id: orderId,
                user_id: req.user.id
            }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this order'
            });
        }

        const review = await Review.create({
            user_id: req.user.id,
            order_id: orderId,
            title,
            review_text: reviewText
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns this review
        if (review.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const { title, reviewText } = req.body;
        const updateData = {};
        if (title) updateData.title = title;
        if (reviewText) updateData.review_text = reviewText;

        await review.update(updateData);

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.destroy();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
