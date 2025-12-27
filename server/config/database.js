import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

// Test connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ PostgreSQL Connected');

        // Sync models (create tables)
        // WARNING: force:true drops existing tables on every restart!
        await sequelize.sync({ force: true });
        console.log('✓ Database synced (tables created)');
    } catch (error) {
        console.error('✗ Unable to connect to PostgreSQL:', error.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default sequelize;
