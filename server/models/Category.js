import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'product_category',
    timestamps: true
});

export default Category;
