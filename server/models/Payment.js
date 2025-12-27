import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    payment_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    picture_name: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'rejected'),
        defaultValue: 'pending'
    },
    confirmed_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    payment_data: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'payments',
    timestamps: true
});

export default Payment;
