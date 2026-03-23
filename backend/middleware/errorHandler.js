
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;

    console.error(err);


    if (err.name === 'BSONError' || err.name === 'BSONTypeError') {
        const message = `Invalid ID format provided`;
        error = new AppError(message, 400);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }

    res.status(error.statusCode).json({
        success: false,
        status: error.status,
        error: error.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { AppError, errorHandler };
