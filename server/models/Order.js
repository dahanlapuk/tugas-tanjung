import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    coupon_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'coupons',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    order_number: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true
    },
    order_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered'),
        defaultValue: 'pending'
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    total_items: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    payment_method: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    delivery_data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    delivered_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    finish_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true
});

export default Order;
