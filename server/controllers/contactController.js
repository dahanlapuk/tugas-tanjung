import { Contact } from '../models/index.js';

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const where = {};
        if (status) {
            where.status = Number(status);
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Contact.findAndCountAll({
            where,
            include: [{
                model: Contact,
                as: 'parent'
            }],
            limit: parseInt(limit),
            offset,
            order: [['contact_date', 'DESC']]
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

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByPk(req.params.id, {
            include: [{
                model: Contact,
                as: 'parent'
            }]
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Mark as read
        if (contact.status === 1) {
            await contact.update({ status: 2 });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send contact message
// @route   POST /api/contacts
// @access  Public
export const sendContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Your message has been sent successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reply to contact
// @route   POST /api/contacts/:id/reply
// @access  Private/Admin
export const replyContact = async (req, res, next) => {
    try {
        const { message } = req.body;
        const parentContact = await Contact.findByPk(req.params.id);

        if (!parentContact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Create reply
        const reply = await Contact.create({
            parent_id: parentContact.id,
            name: 'Admin',
            email: parentContact.email,
            subject: `Re: ${parentContact.subject}`,
            message
        });

        // Update parent contact status
        await parentContact.update({
            status: 3,
            reply_at: new Date()
        });

        res.status(201).json({
            success: true,
            data: reply
        });
    } catch (error) {
        next(error);
    }
};
