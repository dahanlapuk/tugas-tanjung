import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config({ path: '../server/.env' });

// Import models
import User from '../server/models/User.js';
import Customer from '../server/models/Customer.js';
import Category from '../server/models/Category.js';
import Product from '../server/models/Product.js';
import Order from '../server/models/Order.js';
import Payment from '../server/models/Payment.js';
import Coupon from '../server/models/Coupon.js';
import Review from '../server/models/Review.js';
import Contact from '../server/models/Contact.js';
import Setting from '../server/models/Setting.js';

// MySQL connection config
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
};

async function migrate() {
    try {
        console.log('Starting migration from MySQL to MongoDB...\n');

        // Connect to MySQL
        const mysqlConnection = await mysql.createConnection(mysqlConfig);
        console.log('✓ Connected to MySQL');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        // Clear existing MongoDB data
        console.log('Clearing existing MongoDB data...');
        await Promise.all([
            User.deleteMany({}),
            Customer.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Order.deleteMany({}),
            Payment.deleteMany({}),
            Coupon.deleteMany({}),
            Review.deleteMany({}),
            Contact.deleteMany({}),
            Setting.deleteMany({})
        ]);
        console.log('✓ Cleared MongoDB\n');

        // Migrate Users
        console.log('Migrating users...');
        const [users] = await mysqlConnection.execute('SELECT * FROM users');
        const userMap = {};

        for (const user of users) {
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                username: user.username,
                password: user.password, // Already hashed
                role: user.role === 'admin' ? 'admin' : 'customer',
                profilePicture: user.profile_picture,
                emailVerified: user.email_verified_at ? true : false,
                createdAt: user.register_date || new Date()
            });
            userMap[user.id] = newUser._id;
        }
        console.log(`✓ Migrated ${users.length} users\n`);

        // Migrate Customers
        console.log('Migrating customers...');
        const [customers] = await mysqlConnection.execute('SELECT * FROM customers');

        for (const customer of customers) {
            if (userMap[customer.user_id]) {
                await Customer.create({
                    userId: userMap[customer.user_id],
                    name: customer.name,
                    phoneNumber: customer.phone_number,
                    address: customer.address,
                    profilePicture: customer.profile_picture
                });
            }
        }
        console.log(`✓ Migrated ${customers.length} customers\n`);

        // Migrate Categories
        console.log('Migrating categories...');
        const [categories] = await mysqlConnection.execute('SELECT * FROM product_category');
        const categoryMap = {};

        for (const category of categories) {
            const newCategory = await Category.create({
                name: category.name
            });
            categoryMap[category.id] = newCategory._id;
        }
        console.log(`✓ Migrated ${categories.length} categories\n`);

        // Migrate Products
        console.log('Migrating products...');
        const [products] = await mysqlConnection.execute('SELECT * FROM products');
        const productMap = {};

        for (const product of products) {
            const newProduct = await Product.create({
                categoryId: categoryMap[product.category_id],
                sku: product.sku,
                name: product.name,
                description: product.description,
                pictureName: product.picture_name,
                price: product.price,
                currentDiscount: product.current_discount,
                stock: product.stock,
                productUnit: product.product_unit,
                isAvailable: product.is_available === 1,
                addDate: product.add_date,
                createdAt: product.add_date || new Date()
            });
            productMap[product.id] = newProduct._id;
        }
        console.log(`✓ Migrated ${products.length} products\n`);

        // Migrate Coupons
        console.log('Migrating coupons...');
        const [coupons] = await mysqlConnection.execute('SELECT * FROM coupons');
        const couponMap = {};

        for (const coupon of coupons) {
            const newCoupon = await Coupon.create({
                name: coupon.name,
                code: coupon.code,
                credit: coupon.credit,
                startDate: coupon.start_date,
                expiredDate: coupon.expired_date,
                isActive: coupon.is_active === 1
            });
            couponMap[coupon.id] = newCoupon._id;
        }
        console.log(`✓ Migrated ${coupons.length} coupons\n`);

        // Migrate Orders
        console.log('Migrating orders...');
        const [orders] = await mysqlConnection.execute('SELECT * FROM orders');
        const orderMap = {};

        for (const order of orders) {
            // Get order items
            const [orderItems] = await mysqlConnection.execute(
                'SELECT * FROM order_items WHERE order_id = ?',
                [order.id]
            );

            const items = orderItems.map(item => ({
                productId: productMap[item.product_id],
                orderQty: item.order_qty,
                orderPrice: item.order_price
            }));

            const statusMap = {
                '1': 'pending',
                '2': 'confirmed',
                '3': 'processing',
                '4': 'shipped',
                '5': 'delivered'
            };

            const newOrder = await Order.create({
                userId: userMap[order.user_id],
                couponId: order.coupon_id ? couponMap[order.coupon_id] : null,
                orderNumber: order.order_number,
                orderStatus: statusMap[order.order_status] || 'pending',
                orderDate: order.order_date,
                totalPrice: order.total_price,
                totalItems: order.total_items,
                paymentMethod: order.payment_method,
                deliveryData: order.delivery_data ? JSON.parse(order.delivery_data) : {},
                items: items,
                deliveredDate: order.delivered_date,
                finishDate: order.finish_date
            });
            orderMap[order.id] = newOrder._id;
        }
        console.log(`✓ Migrated ${orders.length} orders\n`);

        // Migrate Payments
        console.log('Migrating payments...');
        const [payments] = await mysqlConnection.execute('SELECT * FROM payments');

        for (const payment of payments) {
            const statusMap = {
                '1': 'pending',
                '2': 'confirmed',
                '3': 'rejected'
            };

            await Payment.create({
                orderId: orderMap[payment.order_id],
                paymentPrice: payment.payment_price,
                paymentDate: payment.payment_date,
                pictureName: payment.picture_name,
                paymentStatus: statusMap[payment.payment_status] || 'pending',
                confirmedDate: payment.confirmed_date,
                paymentData: payment.payment_data ? JSON.parse(payment.payment_data) : {}
            });
        }
        console.log(`✓ Migrated ${payments.length} payments\n`);

        // Migrate Reviews
        console.log('Migrating reviews...');
        const [reviews] = await mysqlConnection.execute('SELECT * FROM reviews');

        for (const review of reviews) {
            await Review.create({
                userId: userMap[review.user_id],
                orderId: orderMap[review.order_id],
                title: review.title,
                reviewText: review.review_text,
                reviewDate: review.review_date,
                status: review.status === 1
            });
        }
        console.log(`✓ Migrated ${reviews.length} reviews\n`);

        // Migrate Contacts
        console.log('Migrating contacts...');
        const [contacts] = await mysqlConnection.execute('SELECT * FROM contacts');

        for (const contact of contacts) {
            await Contact.create({
                parentId: contact.parent_id,
                name: contact.name,
                subject: contact.subject,
                email: contact.email,
                message: contact.message,
                contactDate: contact.contact_date,
                status: contact.status,
                replyAt: contact.reply_at
            });
        }
        console.log(`✓ Migrated ${contacts.length} contacts\n`);

        // Migrate Settings
        console.log('Migrating settings...');
        const [settings] = await mysqlConnection.execute('SELECT * FROM settings');

        for (const setting of settings) {
            await Setting.create({
                key: setting.key,
                content: setting.content
            });
        }
        console.log(`✓ Migrated ${settings.length} settings\n`);

        // Close connections
        await mysqlConnection.end();
        await mongoose.connection.close();

        console.log('\n✅ Migration completed successfully!');
        console.log('\nSummary:');
        console.log(`- Users: ${users.length}`);
        console.log(`- Customers: ${customers.length}`);
        console.log(`- Categories: ${categories.length}`);
        console.log(`- Products: ${products.length}`);
        console.log(`- Coupons: ${coupons.length}`);
        console.log(`- Orders: ${orders.length}`);
        console.log(`- Payments: ${payments.length}`);
        console.log(`- Reviews: ${reviews.length}`);
        console.log(`- Contacts: ${contacts.length}`);
        console.log(`- Settings: ${settings.length}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrate();
