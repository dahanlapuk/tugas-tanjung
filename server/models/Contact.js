import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        default: null
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    contactDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1 // 1 = unread, 2 = read, 3 = replied
    },
    replyAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
