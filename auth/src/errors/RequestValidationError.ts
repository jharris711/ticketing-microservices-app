import { ValidationError } from 'express-validator';
import CustomError from './CustomError';

class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[]) {
    super(`Invalid request parameters`);

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  statusCode = 400;

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}

export default RequestValidationError;
