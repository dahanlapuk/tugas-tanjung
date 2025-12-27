import User from './User.js';
import Customer from './Customer.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Payment from './Payment.js';
import Coupon from './Coupon.js';
import Review from './Review.js';
import Contact from './Contact.js';
import Setting from './Setting.js';

// Define Relationships

// User - Customer (One-to-One)
User.hasOne(Customer, { foreignKey: 'user_id', as: 'customer' });
Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category - Products (One-to-Many)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User - Orders (One-to-Many)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Coupon - Orders (One-to-Many)
Coupon.hasMany(Order, { foreignKey: 'coupon_id', as: 'orders' });
Order.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

// Order - OrderItems (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product - OrderItems (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order - Payment (One-to-One)
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// User - Reviews (One-to-Many)
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order - Reviews (One-to-Many)
Order.hasMany(Review, { foreignKey: 'order_id', as: 'reviews' });
Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Contact - Contact (Self-referencing for replies)
Contact.hasMany(Contact, { foreignKey: 'parent_id', as: 'replies' });
Contact.belongsTo(Contact, { foreignKey: 'parent_id', as: 'parent' });

export {
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
};
