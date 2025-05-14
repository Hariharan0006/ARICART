const { request } = require('http');
const catchAsyncError = require('../middlewares/catchAsyncError');
const User =require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken =require('../utils/jwt');
const crypto = require('crypto')

// register user - api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) =>{
    const {name,email,password} = req.body
    
    let avatar;
    if (req.file) {
        avatar = `${req.protocol}://${req.host}/uploads/user/${req.file.originalname}`
    }
    if (req.file) {
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.filename}`;
    }
    

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });
    
    sendToken(user, 201, res)
    
})
// Login user - /api/v1/loginUser
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Finding the user in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email & password', 401));
    }

    // Validate the password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler('Invalid email & password', 401));
    }

    // Send token to the user
    sendToken(user, 201, res);
});


// login user - /api/v1/logoutUser
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out',
    });
};



// forgotPassword - forgotPassword    USING MAILTRAP

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Generate Reset Token
    const resetToken = user.getResetToken(); // Ensure the method name matches your User schema
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset URL is as follows:\n\n
    ${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

    try {
        // Send email
        await sendEmail({
            email: user.email,
            subject: 'ARIcart Password Recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });
    } catch (error) {
        // Cleanup token fields on error
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// ResetPassword  - {{base_url}}/api/v1//password/reset/ token : 70562c1073eb4d90a514a52188e176bce3aeef47
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    console.log('Incoming Params:', req.params);
    console.log('Request Body:', req.body);

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log('Hashed Token:', resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() },
    });

    console.log('User Found:', user);

    if (!user) {
        return next(new ErrorHandler('password reset token is invalid or expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password does not match', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 201, res);
});

//get userr profile - {{base_url}}/api/v1/myprofile

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});



// Change Pasword  - /api/v1//password/change
exports.changePassword =catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');
    

    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect'))
    }

    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true,

    })

})

// UpdATE pROFILE -api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next)=>{
    let newUserDate = {
        name: req.body.name,
        email: req.body.email
    }
    
    let avatar;
    if (req.file) {
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
        newUserDate= {...newUserDate,avatar}
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserDate, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: GEt all users - }/api/v1/admin/users
exports.getAllUsers =  catchAsyncError(async (req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
})



//Admin: GEt Specific User - {{base_url}}/api/v1/admin/user/6767dc655d2dcec4da2e37c5
exports.getUser =  catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })

});

//Admin: Update User - {{base_url}}/api/v1/admin/user/6767dc655d2dcec4da2e37c5
exports.updateUser = catchAsyncError(async (req, res, next)=>{
    const newUserDate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserDate, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user,
    })
})


// Admin: Delete user - /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this ID: ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: `User with ID: ${req.params.id} has been deleted.`,
    });
});

