import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
    User,
    Customer,
    Category,
    Product,
    Order,
    OrderItem,
    Payment,
    Coupon,
    Review,
    Contact,
    Setting
} from '../server/models/index.js';

dotenv.config({ path: '../server/.env' });

// MySQL Connection
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
};

// PostgreSQL Connection (using Sequelize from server)
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

async function migrate() {
    let mysqlConnection;

    try {
        console.log('🚀 Starting MySQL to PostgreSQL migration...\n');

        // Connect to MySQL
        console.log('📡 Connecting to MySQL...');
        mysqlConnection = await mysql.createConnection(mysqlConfig);
        console.log('✓ MySQL connected\n');

        // Connect to PostgreSQL
        console.log('📡 Connecting to PostgreSQL...');
        await sequelize.authenticate();
        console.log('✓ PostgreSQL connected\n');

        // Sync models (create tables)
        console.log('📋 Creating PostgreSQL tables...');
        await sequelize.sync({ force: true }); // WARNING: This drops existing tables!
        console.log('✓ Tables created\n');

        // ID mappings
        const userIdMap = {};
        const categoryIdMap = {};
        const productIdMap = {};
        const orderIdMap = {};
        const couponIdMap = {};

        // Migrate Users
        console.log('👤 Migrating users...');
        const [mysqlUsers] = await mysqlConnection.execute('SELECT * FROM users');
        for (const user of mysqlUsers) {
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                username: user.username,
                password: user.password, // Already hashed
                role: user.role === 1 ? 'admin' : 'customer',
                profile_picture: user.profile_picture,
                email_verified: user.email_verified === 1,
                created_at: user.created_at,
                updated_at: user.updated_at
            }, {
                hooks: false // Skip password hashing since already hashed
            });
            userIdMap[user.id] = newUser.id;
        }
        console.log(`✓ Migrated ${mysqlUsers.length} users\n`);

        // Migrate Customers
        console.log('👥 Migrating customers...');
        const [mysqlCustomers] = await mysqlConnection.execute('SELECT * FROM customers');
        for (const customer of mysqlCustomers) {
            if (userIdMap[customer.user_id]) {
                await Customer.create({
                    user_id: userIdMap[customer.user_id],
                    name: customer.name,
                    phone_number: customer.phone_number,
                    address: customer.address,
                    profile_picture: customer.profile_picture,
                    created_at: customer.created_at,
                    updated_at: customer.updated_at
                });
            }
        }
        console.log(`✓ Migrated ${mysqlCustomers.length} customers\n`);

        // Migrate Categories
        console.log('📂 Migrating categories...');
        const [mysqlCategories] = await mysqlConnection.execute('SELECT * FROM product_category');
        for (const category of mysqlCategories) {
            const newCategory = await Category.create({
                name: category.name,
                created_at: category.created_at,
                updated_at: category.updated_at
            });
            categoryIdMap[category.id] = newCategory.id;
        }
        console.log(`✓ Migrated ${mysqlCategories.length} categories\n`);

        // Migrate Products
        console.log('📦 Migrating products...');
        const [mysqlProducts] = await mysqlConnection.execute('SELECT * FROM products');
        for (const product of mysqlProducts) {
            const newProduct = await Product.create({
                category_id: categoryIdMap[product.category_id] || null,
                sku: product.sku,
                name: product.name,
                description: product.description,
                picture_name: product.picture_name,
                price: product.price,
                current_discount: product.current_discount,
                stock: product.stock,
                product_unit: product.product_unit,
                is_available: product.is_available === 1,
                add_date: product.add_date,
                created_at: product.created_at,
                updated_at: product.updated_at
            });
            productIdMap[product.id] = newProduct.id;
        }
        console.log(`✓ Migrated ${mysqlProducts.length} products\n`);

        // Migrate Coupons
        console.log('🎟️  Migrating coupons...');
        const [mysqlCoupons] = await mysqlConnection.execute('SELECT * FROM coupons');
        for (const coupon of mysqlCoupons) {
            const newCoupon = await Coupon.create({
                name: coupon.name,
                code: coupon.code,
                credit: coupon.credit,
                start_date: coupon.start_date,
                expired_date: coupon.expired_date,
                is_active: coupon.is_active === 1,
                created_at: coupon.created_at,
                updated_at: coupon.updated_at
            });
            couponIdMap[coupon.id] = newCoupon.id;
        }
        console.log(`✓ Migrated ${mysqlCoupons.length} coupons\n`);

        // Migrate Orders
        console.log('🛒 Migrating orders...');
        const [mysqlOrders] = await mysqlConnection.execute('SELECT * FROM orders');
        for (const order of mysqlOrders) {
            const newOrder = await Order.create({
                user_id: userIdMap[order.user_id],
                coupon_id: couponIdMap[order.coupon_id] || null,
                order_number: order.order_number,
                order_status: order.order_status,
                order_date: order.order_date,
                total_price: order.total_price,
                total_items: order.total_items,
                payment_method: order.payment_method,
                delivery_data: order.delivery_data ? JSON.parse(order.delivery_data) : null,
                delivered_date: order.delivered_date,
                finish_date: order.finish_date,
                created_at: order.created_at,
                updated_at: order.updated_at
            });
            orderIdMap[order.id] = newOrder.id;
        }
        console.log(`✓ Migrated ${mysqlOrders.length} orders\n`);

        // Migrate Order Items
        console.log('📋 Migrating order items...');
        const [mysqlOrderItems] = await mysqlConnection.execute('SELECT * FROM order_items');
        for (const item of mysqlOrderItems) {
            if (orderIdMap[item.order_id] && productIdMap[item.product_id]) {
                await OrderItem.create({
                    order_id: orderIdMap[item.order_id],
                    product_id: productIdMap[item.product_id],
                    order_qty: item.order_qty,
                    order_price: item.order_price,
                    created_at: item.created_at,
                    updated_at: item.updated_at
                });
            }
        }
        console.log(`✓ Migrated ${mysqlOrderItems.length} order items\n`);

        // Migrate Payments
        console.log('💳 Migrating payments...');
        const [mysqlPayments] = await mysqlConnection.execute('SELECT * FROM payments');
        for (const payment of mysqlPayments) {
            if (orderIdMap[payment.order_id]) {
                await Payment.create({
                    order_id: orderIdMap[payment.order_id],
                    payment_price: payment.payment_price,
                    payment_date: payment.payment_date,
                    picture_name: payment.picture_name,
                    payment_status: payment.payment_status,
                    confirmed_date: payment.confirmed_date,
                    payment_data: payment.payment_data ? JSON.parse(payment.payment_data) : null,
                    created_at: payment.created_at,
                    updated_at: payment.updated_at
                });
            }
        }
        console.log(`✓ Migrated ${mysqlPayments.length} payments\n`);

        // Migrate Reviews
        console.log('⭐ Migrating reviews...');
        const [mysqlReviews] = await mysqlConnection.execute('SELECT * FROM reviews');
        for (const review of mysqlReviews) {
            if (userIdMap[review.user_id] && orderIdMap[review.order_id]) {
                await Review.create({
                    user_id: userIdMap[review.user_id],
                    order_id: orderIdMap[review.order_id],
                    title: review.title,
                    review_text: review.review_text,
                    review_date: review.review_date,
                    status: review.status === 1,
                    created_at: review.created_at,
                    updated_at: review.updated_at
                });
            }
        }
        console.log(`✓ Migrated ${mysqlReviews.length} reviews\n`);

        // Migrate Contacts
        console.log('📧 Migrating contacts...');
        const [mysqlContacts] = await mysqlConnection.execute('SELECT * FROM contacts');
        const contactIdMap = {};

        for (const contact of mysqlContacts) {
            const newContact = await Contact.create({
                parent_id: contactIdMap[contact.parent_id] || null,
                name: contact.name,
                subject: contact.subject,
                email: contact.email,
                message: contact.message,
                contact_date: contact.contact_date,
                status: contact.status,
                reply_at: contact.reply_at,
                created_at: contact.created_at,
                updated_at: contact.updated_at
            });
            contactIdMap[contact.id] = newContact.id;
        }
        console.log(`✓ Migrated ${mysqlContacts.length} contacts\n`);

        // Migrate Settings
        console.log('⚙️  Migrating settings...');
        const [mysqlSettings] = await mysqlConnection.execute('SELECT * FROM settings');
        for (const setting of mysqlSettings) {
            await Setting.create({
                key: setting.key,
                content: setting.content,
                created_at: setting.created_at,
                updated_at: setting.updated_at
            });
        }
        console.log(`✓ Migrated ${mysqlSettings.length} settings\n`);

        console.log('✅ Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${mysqlUsers.length}`);
        console.log(`   Customers: ${mysqlCustomers.length}`);
        console.log(`   Categories: ${mysqlCategories.length}`);
        console.log(`   Products: ${mysqlProducts.length}`);
        console.log(`   Coupons: ${mysqlCoupons.length}`);
        console.log(`   Orders: ${mysqlOrders.length}`);
        console.log(`   Order Items: ${mysqlOrderItems.length}`);
        console.log(`   Payments: ${mysqlPayments.length}`);
        console.log(`   Reviews: ${mysqlReviews.length}`);
        console.log(`   Contacts: ${mysqlContacts.length}`);
        console.log(`   Settings: ${mysqlSettings.length}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        if (mysqlConnection) {
            await mysqlConnection.end();
        }
        await sequelize.close();
    }
}

// Run migration
migrate()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Error:', error.message);
        process.exit(1);
    });
