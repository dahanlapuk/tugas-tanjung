import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    parent_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'contacts',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(191),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(191),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    contact_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    reply_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'contacts',
    timestamps: true
});

export default Contact;
