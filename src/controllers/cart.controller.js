const cartService = require('../services/cart.service');

exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user._id);
        res.json({
            success: true,
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ success: false, message: 'Failed to get cart' });
    }
};

exports.addItem = async (req, res) => {
    try {
        const cart = await cartService.addItem(req.user._id, req.body);
        res.json({
            success: true,
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        console.error('Add Item Error:', error);
        res.status(500).json({ success: false, message: 'Failed to add item' });
    }
};

exports.updateItemQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartService.updateItemQuantity(req.user._id, req.params.itemId, quantity);
        res.json({
            success: true,
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        console.error('Update Quantity Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update quantity' });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const cart = await cartService.removeItem(req.user._id, req.params.itemId);
        res.json({
            success: true,
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        console.error('Remove Item Error:', error);
        res.status(500).json({ success: false, message: 'Failed to remove item' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.user._id);
        res.json({
            success: true,
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: 0
            }
        });
    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({ success: false, message: 'Failed to clear cart' });
    }
};

exports.mergeCart = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Items array is required' });
        }
        const cart = await cartService.mergeCart(req.user._id, items);
        res.json({
            success: true,
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        });
    } catch (error) {
        console.error('Merge Cart Error:', error);
        res.status(500).json({ success: false, message: 'Failed to merge cart' });
    }
};
