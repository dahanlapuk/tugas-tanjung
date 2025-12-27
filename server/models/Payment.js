import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentPrice: {
        type: Number,
        required: true,
        min: 0
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    pictureName: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    confirmedDate: {
        type: Date,
        default: null
    },
    paymentData: {
        transferTo: String,
        source: {
            bank: String,
            name: String,
            number: String
        }
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
