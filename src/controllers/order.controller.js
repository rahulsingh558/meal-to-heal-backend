const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
    try {
        const { status, paymentStatus, search, startDate, endDate, userId, limit = 20, skip = 0, sortBy = '-createdAt' } = req.query;

        let query = {};

        if (status) query.orderStatus = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (userId) query.userId = userId;
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { customerEmail: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } }
            ];
            const orderNum = parseInt(search);
            if (!isNaN(orderNum)) {
                query.$or.push({ orderNumber: orderNum });
            }
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort(sortBy)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('userId', 'name email');

        res.json({
            success: true,
            orders,
            total,
            page: Math.floor(parseInt(skip) / parseInt(limit)) + 1,
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get orders' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get order' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'Order updated', order });
    } catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update order' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        console.error('Delete Order Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete order' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, cancelReason } = req.body;
        const updateData = { orderStatus: status };

        if (status === 'delivered') updateData.deliveredAt = new Date();
        if (status === 'cancelled') {
            updateData.cancelledAt = new Date();
            if (cancelReason) updateData.cancelReason = cancelReason;
        }

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: `Order ${status}`, order });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

exports.getOrderStats = async (req, res) => {
    try {
        const { period = '7d' } = req.query;

        let periodDate = new Date();
        switch (period) {
            case '24h': periodDate.setDate(periodDate.getDate() - 1); break;
            case '7d': periodDate.setDate(periodDate.getDate() - 7); break;
            case '30d': periodDate.setDate(periodDate.getDate() - 30); break;
            case '90d': periodDate.setDate(periodDate.getDate() - 90); break;
            case '1y': periodDate.setFullYear(periodDate.getFullYear() - 1); break;
            default: periodDate.setDate(periodDate.getDate() - 7);
        }

        const totalOrders = await Order.countDocuments();
        const periodOrders = await Order.countDocuments({ createdAt: { $gte: periodDate } });

        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        const periodRevenueResult = await Order.aggregate([
            { $match: { createdAt: { $gte: periodDate }, orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const periodRevenue = periodRevenueResult[0]?.total || 0;

        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const statusBreakdown = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            stats: { totalOrders, periodOrders, totalRevenue, periodRevenue, avgOrderValue, statusBreakdown }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get stats' });
    }
};

exports.getRevenueData = async (req, res) => {
    try {
        const { period = '7d', groupBy = 'day' } = req.query;

        let periodDate = new Date();
        switch (period) {
            case '7d': periodDate.setDate(periodDate.getDate() - 7); break;
            case '30d': periodDate.setDate(periodDate.getDate() - 30); break;
            case '90d': periodDate.setDate(periodDate.getDate() - 90); break;
            case '1y': periodDate.setFullYear(periodDate.getFullYear() - 1); break;
            default: periodDate.setDate(periodDate.getDate() - 7);
        }

        let groupByField = {};
        if (groupBy === 'day') {
            groupByField = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };
        } else {
            groupByField = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
        }

        const revenueData = await Order.aggregate([
            { $match: { createdAt: { $gte: periodDate }, orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: groupByField, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.json({ success: true, revenueData });
    } catch (error) {
        console.error('Get Revenue Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get revenue data' });
    }
};

exports.getBestSellingItems = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const bestSelling = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.foodId',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.json({ success: true, bestSelling });
    } catch (error) {
        console.error('Get Best Selling Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get best selling items' });
    }
};
