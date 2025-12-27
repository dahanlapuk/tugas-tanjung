import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    totalItems: {
        type: Number,
        required: true,
        min: 1
    },
    paymentMethod: {
        type: Number,
        default: 1
    },
    deliveryData: {
        customer: {
            name: String,
            phoneNumber: String,
            address: String
        },
        note: String
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        orderQty: {
            type: Number,
            required: true,
            min: 1
        },
        orderPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    deliveredDate: {
        type: Date,
        default: null
    },
    finishDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
