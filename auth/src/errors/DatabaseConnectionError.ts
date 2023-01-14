class DatabaseConnectionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  reason = `Error connecting to Database`;
}

export default DatabaseConnectionError;
