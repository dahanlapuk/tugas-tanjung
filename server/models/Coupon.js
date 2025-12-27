import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true
    },
    credit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expired_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'coupons',
    timestamps: true
});

// Method to check if coupon is valid
Coupon.prototype.isValid = function () {
    const now = new Date();
    return this.is_active &&
        this.start_date <= now &&
        this.expired_date >= now;
};

export default Coupon;
