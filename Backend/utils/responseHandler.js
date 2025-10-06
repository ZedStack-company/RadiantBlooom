const responseHandler = (res, statusCode, success, data = null, message = null, error = null) => {
  const response = {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error })
  };

  return res.status(statusCode).json(response);
};

module.exports = { responseHandler };