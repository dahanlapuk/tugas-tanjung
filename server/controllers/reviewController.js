import Review from '../models/Review.js';
import Order from '../models/Order.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ status: true })
            .populate('userId', 'name profilePicture')
            .populate('orderId', 'orderNumber')
            .sort('-reviewDate')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Review.countDocuments({ status: true });

        res.status(200).json({
            success: true,
            data: reviews,
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

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
    try {
        const { orderId, title, reviewText } = req.body;

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
                message: 'Not authorized to review this order'
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ orderId, userId: req.user.id });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this order'
            });
        }

        const review = await Review.create({
            userId: req.user.id,
            orderId,
            title,
            reviewText
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
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns this review
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const { title, reviewText } = req.body;

        if (title) review.title = title;
        if (reviewText) review.reviewText = reviewText;

        await review.save();

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
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
