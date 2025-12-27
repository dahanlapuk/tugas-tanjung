import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    pictureName: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    currentDiscount: {
        type: Number,
        default: 0,
        min: 0
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: 0,
        default: 0
    },
    productUnit: {
        type: String,
        default: 'Pcs'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    addDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function () {
    return this.price - this.currentDiscount;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
