// Centralized error handling middleware
module.exports = function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

