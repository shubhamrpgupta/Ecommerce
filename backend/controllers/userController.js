const User = require("../models/userModel")
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHandler = require("../Utils/errorHandler");
const sendTokenAndResponse = require("../Utils/jwtToken");
const sendToken = require("../Utils/jwtToken");


//Register New User
module.exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, role } = req.body;
    const newUser = await User.create({
        name, email, password, role,
        avator: {
            public_id: "example",
            url: "exampleURL"
        }
    })

    sendTokenAndResponse(newUser, 201, res);
});


//login User
module.exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400))
    }

    const findUser = await User.findOne({ email: email }).select("+password");
    if (!findUser) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched = await findUser.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendTokenAndResponse(findUser, 200, res);
});


//Logout user
module.exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token",
        null,
        { expires: new Date(Date.now()), httpOnly: true }
    )

    res.status(200).json({ success: true, message: "LoggedOut" })
});


//Get loggedIn User Details
module.exports.getUserDetails = catchAsyncError(async (req, res, next) => {

    const foundUser = await User.findById(req.user.id);

    res.status(200).json({ success: true, foundUser })

});


//Update LoggedIn User Password
module.exports.updatePassword = catchAsyncError(async (req, res, next) => {

    const foundUser = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await foundUser.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Passwrod is incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }

    foundUser.password = req.body.newPassword;
    await foundUser.save();

    sendTokenAndResponse(foundUser, 200, res);
});


//Update LoggedIn User Profile
module.exports.updateProfile = catchAsyncError(async (req, res, next) => {

    const userNewData = {
        name: req.body.name,
        email: req.body.email
    };

    const updateUser = await User.findByIdAndUpdate(req.user.id, userNewData, {
        new: true, runValidators: true, useFindAndModify: false
    });

    res.status(200).json({ success: true });
});


//Get All User by Admin
module.exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const allUsers = await User.find();
    res.status(200).json({ success: true, allUsers });

});


//Get Single User Details by Admin
module.exports.getSingleUserDetailByAdmin = catchAsyncError(async (req, res, next) => {

    const singleUser = await User.findById(req.params.id);
    if (!singleUser) {
        return next(new ErrorHandler(`User does not exist with id:${req.params.id}`))
    }

    res.status(200).json({ success: true, singleUser });
});


//Update User Role by Admin
module.exports.updateUserRole = catchAsyncError(async (req, res, next) => {

    const userNewData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };
    const user = await User.findByIdAndUpdate(req.params.id, userNewData, {
        new: true, runValidators: true, useFindAndModify: false
    });

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id:${req.params.id}`))
    }

    res.status(200).json({ success: true });
});


//Delete User by Admin
module.exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const findUserToDelete = await User.findById(req.params.id)
    if (!findUserToDelete) {
        return next(new ErrorHandler(`User does not exist with id:${req.params.id}`))
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "User Deleted Successfully" });
});