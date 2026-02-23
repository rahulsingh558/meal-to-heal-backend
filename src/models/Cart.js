const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    customizations: {
        type: Object,
        default: {}
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', async function () {
    this.total = this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
});

// Method to add item to cart
cartSchema.methods.addItem = function (item) {
    const existingItem = this.items.find(i => {
        const itemId1 = i.menuItemId ? i.menuItemId.toString() : String(i.menuItemId);
        const itemId2 = item.menuItemId ? String(item.menuItemId) : '';
        return itemId1 === itemId2 &&
            JSON.stringify(i.customizations) === JSON.stringify(item.customizations);
    });

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        this.items.push(item);
    }

    return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
    const item = this.items.id(itemId);
    if (item) {
        if (quantity <= 0) {
            this.items.pull(itemId);
        } else {
            item.quantity = quantity;
        }
    }
    return this.save();
};

// Method to remove item
cartSchema.methods.removeItem = function (itemId) {
    this.items.pull(itemId);
    return this.save();
};

// Method to clear cart
cartSchema.methods.clearItems = function () {
    this.items = [];
    return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
