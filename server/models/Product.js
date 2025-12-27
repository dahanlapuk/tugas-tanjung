import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'product_category',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    sku: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    picture_name: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    current_discount: {
        type: DataTypes.DECIMAL(8, 2),
        defaultValue: 0.00
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    product_unit: {
        type: DataTypes.STRING(32),
        defaultValue: 'Pcs'
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    add_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'products',
    timestamps: true
});

// Virtual field for final price
Product.prototype.getFinalPrice = function () {
    return parseFloat(this.price) - parseFloat(this.current_discount || 0);
};

export default Product;
