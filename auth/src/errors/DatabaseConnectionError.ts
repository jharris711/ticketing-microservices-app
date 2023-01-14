import CustomError from './CustomError';

class DatabaseConnectionError extends CustomError {
  constructor() {
    super(`Error connecting to database`);
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  reason = `Error connecting to Database`;
  statusCode = 503;

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

export default DatabaseConnectionError;
