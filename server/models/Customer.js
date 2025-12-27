import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
