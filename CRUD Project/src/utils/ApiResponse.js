const ApiResponse = (statusCode, data, message) => {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400,

    send(res) {
      return res.status(this.statusCode).json({
        statusCode: this.statusCode,
        data: this.data,
        message: this.message,
        success: this.success,
      });
    },
  };
};
module.exports = ApiResponse;