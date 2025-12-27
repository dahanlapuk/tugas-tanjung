import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    title: {
        type: String,
        trim: true
    },
    reviewText: {
        type: String,
        required: [true, 'Review text is required'],
        trim: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
