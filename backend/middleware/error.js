const ErrorHandler = require("../Utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error"


    //if Wrong Mongo id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }


    //Mongoose duplicate key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);
    }


    //Wrong JsonWebToken Error
    if (err.code === "JsonWebTokenError") {
        const message = `JSON Web Token is Invalid, Try again!`
        err = new ErrorHandler(message, 400);
    }


    //JWT expire Error
    if (err.code === "TokenExpiredError") {
        const message = `JSON Web Token is Expired, Try again!`
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statuscode).json({
        success: false,
        message: err.message,
        error: err.stack
    })
}