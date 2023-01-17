import CustomError from './CustomError';

class NotAuthorizedError extends CustomError {
  constructor() {
    super(`Not Authorized`);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  statusCode = 401;

  serializeErrors() {
    return [{ message: `Not Authorized` }];
  }
}

export default NotAuthorizedError;
