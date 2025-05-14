class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent constructor (Error)
        this.statusCode = statusCode;

        // Captures the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the ErrorHandler class
module.exports = ErrorHandler;


module.exports = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
