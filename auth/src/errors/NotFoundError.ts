import CustomError from './CustomError';

class NotFoundError extends CustomError {
  constructor() {
    super(`Route not found`);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  statusCode = 404;

  serializeErrors() {
    return [{ message: 'NotFound' }];
  }
}

export default NotFoundError;
