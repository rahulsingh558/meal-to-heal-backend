const Cart = require('../models/Cart');

class CartService {
    async getCart(userId) {
        let cart = await Cart.findOne({ userId }).populate('items.menuItemId');
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }
        return cart;
    }

    async addItem(userId, itemData) {
        const cart = await this.getCart(userId);
        const item = {
            menuItemId: itemData.menuItemId,
            name: itemData.name,
            price: itemData.price,
            quantity: itemData.quantity || 1,
            customizations: itemData.customizations || {}
        };
        await cart.addItem(item);
        return cart.populate('items.menuItemId');
    }

    async updateItemQuantity(userId, itemId, quantity) {
        const cart = await this.getCart(userId);
        await cart.updateItemQuantity(itemId, quantity);
        return cart.populate('items.menuItemId');
    }

    async removeItem(userId, itemId) {
        const cart = await this.getCart(userId);
        await cart.removeItem(itemId);
        return cart.populate('items.menuItemId');
    }

    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await cart.clearItems();
        return cart;
    }

    async mergeCart(userId, guestCartItems) {
        const cart = await this.getCart(userId);
        for (const item of guestCartItems) {
            await cart.addItem({
                menuItemId: item.menuItemId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                customizations: item.customizations || {}
            });
        }
        return cart.populate('items.menuItemId');
    }

    async getItemCount(userId) {
        const cart = await this.getCart(userId);
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }
}

module.exports = new CartService();
