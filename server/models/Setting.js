import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'Key is required'],
        unique: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    }
}, {
    timestamps: true
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
