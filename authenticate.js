const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/userModel');
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
/**
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please log in to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler("User not found", 404));
    }

    next();
});
 */

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please log in to access this resource", 401));
    }

    // Verify token using the correct secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
        return next(new ErrorHandler("User not found", 404));
    }

    next();
});
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401));
        }
        next();
    };
};


// Controller function to login a user and issue a token
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    res.status(200).json({
        success: true,
        token,
    });
});
