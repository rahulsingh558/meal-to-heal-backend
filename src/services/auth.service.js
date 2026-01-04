const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password (plain text)
   * @returns {Promise<Object>} Success message
   * @throws {Error} If validation fails or user already exists
   */
  async registerUser({ name, email, password }) {
    // Validation
    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return { message: "User registered successfully" };
  }

  /**
   * Login user and generate JWT token
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password (plain text)
   * @returns {Promise<Object>} Token and user data
   * @throws {Error} If credentials are invalid
   */
  async loginUser({ email, password }) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Get user by ID
   * @param {string} userId - User's MongoDB ObjectId
   * @returns {Promise<Object>} User data
   * @throws {Error} If user not found
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
