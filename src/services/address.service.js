const User = require('../models/User');

exports.getUserAddresses = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.addresses || [];
};

exports.addAddress = async (userId, addressData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (addressData.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses[user.addresses.length - 1];
};

exports.updateAddress = async (userId, addressIndex, addressData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
        throw new Error('Invalid address index');
    }

    if (addressData.isDefault) {
        user.addresses.forEach((addr, idx) => {
            if (idx !== addressIndex) {
                addr.isDefault = false;
            }
        });
    }

    Object.assign(user.addresses[addressIndex], addressData);
    await user.save();
    return user.addresses[addressIndex];
};

exports.deleteAddress = async (userId, addressIndex) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
        throw new Error('Invalid address index');
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();
    return { message: 'Address deleted successfully' };
};

exports.setDefaultAddress = async (userId, addressIndex) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
        throw new Error('Invalid address index');
    }

    user.addresses.forEach(addr => addr.isDefault = false);
    user.addresses[addressIndex].isDefault = true;
    await user.save();
    return user.addresses[addressIndex];
};
