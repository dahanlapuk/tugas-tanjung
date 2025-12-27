import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    profilePicture: {
        type: String,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    const bcrypt = await import('bcryptjs');
    return await bcrypt.default.compare(candidatePassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    this.password = await bcrypt.default.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
