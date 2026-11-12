const notFound = (req, res) => res.status(404).json({
  success: false,
  message: `Route not found: ${req.method} ${req.originalUrl}`
});

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((item) => item.message).join(", ");
  }
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource ID";
  }
  if (err.code === 11000) {
    status = 409;
    message = "An account with this email already exists";
  }
  res.status(status).json({
    success: false,
    message: status === 500 && process.env.NODE_ENV === "production" ? "Internal server error" : message
  });
};

module.exports = { notFound, errorHandler };
