const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.log(err);

        //Mongoose bad object error
        if (err.name === "CastError") {
            const message = `Resources not found. Invalid ${err.path}:${err.value}`;
            error = new Error(message);
            error.statusCode = 404;
        }
        //Mongoose Duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate Values for ${Object.keys(
                err.keyValue
            )} entered`;
            error = new Error(message);
            error.statusCode = 400;
        }
        //Validation Error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((value) => value.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;