const ErrorHandler = require("../Utils/errorHandler");
const User = require("../models/userModel");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken")

module.exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const savedToken = req.cookies.token;

    if (!savedToken) {
        return next(new ErrorHandler("Please Login to access", 401))
    };

    const decodedData = jwt.verify(savedToken, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
})


module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access`, 403))
        }
        next();
    };
};