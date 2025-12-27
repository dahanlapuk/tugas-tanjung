import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Coupon name is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    credit: {
        type: Number,
        required: [true, 'Credit amount is required'],
        min: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    expiredDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return this.isActive &&
        this.startDate <= now &&
        this.expiredDate >= now;
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
