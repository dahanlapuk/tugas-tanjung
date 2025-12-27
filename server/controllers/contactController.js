import Contact from '../models/Contact.js';

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = {};
        if (status) {
            query.status = Number(status);
        }

        const contacts = await Contact.find(query)
            .populate('parentId')
            .sort('-contactDate')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
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
        const contact = await Contact.findById(req.params.id)
            .populate('parentId');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Mark as read
        if (contact.status === 1) {
            contact.status = 2;
            await contact.save();
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
        const parentContact = await Contact.findById(req.params.id);

        if (!parentContact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Create reply
        const reply = await Contact.create({
            parentId: parentContact._id,
            name: 'Admin',
            email: parentContact.email,
            subject: `Re: ${parentContact.subject}`,
            message
        });

        // Update parent contact status
        parentContact.status = 3; // Replied
        parentContact.replyAt = new Date();
        await parentContact.save();

        res.status(201).json({
            success: true,
            data: reply
        });
    } catch (error) {
        next(error);
    }
};
