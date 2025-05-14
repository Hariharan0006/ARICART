const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    // Log the error
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    if (process.env.NODE_ENV == 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err,
            timestamp: new Date().toISOString()
        });
    }

}
