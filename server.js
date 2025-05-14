const app = require('./app');
const path = require('path');
const connectDatabase = require('./config/database');

// Connect to the database
connectDatabase();

// Start the server and store the reference to the server
const server = app.listen(process.env.PORT, () => {
    console.log(`My Server listening on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(() => {
        process.exit(1); // Exit the process
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(() => {
        process.exit(1); // Exit the process
    });
});
