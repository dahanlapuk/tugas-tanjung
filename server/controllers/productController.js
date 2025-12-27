import { Op } from 'sequelize';
import { Product, Category } from '../models/index.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 12, category, search, sort = '-created_at' } = req.query;

        const where = {};

        // Filter by category
        if (category) {
            where.category_id = category;
        }

        // Search
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Sorting
        let order = [];
        if (sort.startsWith('-')) {
            order.push([sort.substring(1), 'DESC']);
        } else {
            order.push([sort, 'ASC']);
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }],
            limit: parseInt(limit),
            offset,
            order
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product by SKU
// @route   GET /api/products/sku/:sku
// @access  Public
export const getProductBySKU = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: { sku: req.params.sku },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get best deal product
// @route   GET /api/products/best-deal
// @access  Public
export const getBestDeal = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: {
                current_discount: { [Op.gt]: 0 },
                is_available: true
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }],
            order: [['current_discount', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const relatedProducts = await Product.findAll({
            where: {
                category_id: product.category_id,
                id: { [Op.ne]: product.id },
                is_available: true
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }],
            limit: 4
        });

        res.status(200).json({
            success: true,
            data: relatedProducts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
    try {
        const productData = { ...req.body };

        if (req.file) {
            productData.picture_name = req.file.filename;
        }

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const updateData = { ...req.body };

        if (req.file) {
            updateData.picture_name = req.file.filename;
        }

        await product.update(updateData);

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
