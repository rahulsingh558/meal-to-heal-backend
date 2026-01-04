const Food = require("../models/Food");

class FoodService {
    /**
     * Get all food items
     * @returns {Promise<Array>} Array of all food items
     */
    async getAllFoods() {
        const foods = await Food.find();
        return foods;
    }

    /**
     * Get foods filtered by category
     * @param {string} category - Food category to filter by
     * @returns {Promise<Array>} Array of filtered food items
     */
    async getFoodsByCategory(category) {
        const foods = await Food.find({
            category,
            isAvailable: true
        });
        return foods;
    }

    /**
     * Create a new food item
     * @param {Object} foodData - Food item data
     * @param {string} foodData.name - Food name
     * @param {string} foodData.subtitle - Food subtitle/description
     * @param {number} foodData.basePrice - Base price
     * @param {number} foodData.calories - Calorie count
     * @param {string} foodData.type - Food type (veg, egg, nonveg)
     * @param {string} foodData.category - Food category
     * @param {string} imagePath - Path to uploaded image
     * @param {string} userId - ID of the user creating the food item
     * @returns {Promise<Object>} Created food item
     */
    async createFood(foodData, imagePath, userId) {
        // Parse addon arrays if they're strings (from FormData)
        const defaultAddons = typeof foodData.defaultAddons === 'string'
            ? JSON.parse(foodData.defaultAddons)
            : (foodData.defaultAddons || []);

        const extraAddons = typeof foodData.extraAddons === 'string'
            ? JSON.parse(foodData.extraAddons)
            : (foodData.extraAddons || []);

        const food = await Food.create({
            name: foodData.name,
            subtitle: foodData.subtitle,
            basePrice: foodData.basePrice,
            calories: foodData.calories,
            type: foodData.type,
            category: foodData.category,
            image: imagePath,
            defaultAddons,
            extraAddons,
            createdBy: userId
        });
        return food;
    }

    /**
     * Update an existing food item
     * @param {string} foodId - Food item ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated food item
     */
    async updateFood(foodId, updateData) {
        // Parse addon arrays if they're strings (from FormData)
        if (updateData.defaultAddons && typeof updateData.defaultAddons === 'string') {
            updateData.defaultAddons = JSON.parse(updateData.defaultAddons);
        }

        if (updateData.extraAddons && typeof updateData.extraAddons === 'string') {
            updateData.extraAddons = JSON.parse(updateData.extraAddons);
        }

        const food = await Food.findByIdAndUpdate(
            foodId,
            updateData,
            { new: true }
        );

        if (!food) {
            const error = new Error("Food item not found");
            error.statusCode = 404;
            throw error;
        }

        return food;
    }

    /**
     * Delete a food item
     * @param {string} foodId - Food item ID
     * @returns {Promise<Object>} Success message
     */
    async deleteFood(foodId) {
        const food = await Food.findByIdAndDelete(foodId);

        if (!food) {
            const error = new Error("Food item not found");
            error.statusCode = 404;
            throw error;
        }

        return { message: "Food deleted successfully" };
    }
}

module.exports = new FoodService();
