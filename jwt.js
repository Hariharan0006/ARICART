const sendToken = (user, statusCode, res) => {
    // Creating JWT token
    const token = user.getJwtToken();

    // Setting cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // Set the cookie and send the response
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user,
        });
};

module.exports = sendToken;
