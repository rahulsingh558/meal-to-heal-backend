const addressService = require('../services/address.service');

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await addressService.getUserAddresses(req.user._id);
        res.json({ success: true, addresses });
    } catch (error) {
        console.error('Get Addresses Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const address = await addressService.addAddress(req.user._id, req.body);
        res.status(201).json({ success: true, message: 'Address added', address });
    } catch (error) {
        console.error('Add Address Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const address = await addressService.updateAddress(req.user._id, index, req.body);
        res.json({ success: true, message: 'Address updated', address });
    } catch (error) {
        console.error('Update Address Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const result = await addressService.deleteAddress(req.user._id, index);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Delete Address Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.setDefaultAddress = async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const address = await addressService.setDefaultAddress(req.user._id, index);
        res.json({ success: true, message: 'Default address set', address });
    } catch (error) {
        console.error('Set Default Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
