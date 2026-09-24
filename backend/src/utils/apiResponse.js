export class ApiError extends Error {
  constructor(statusCode, code, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ApiResponse = {
  success: (res, data = null, message = 'Operation successful', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, code = 'INTERNAL_ERROR', message = 'An unexpected error occurred', statusCode = 500, errors = []) => {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        errors,
      },
    });
  },
};
