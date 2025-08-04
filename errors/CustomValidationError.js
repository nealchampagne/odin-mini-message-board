class CustomValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomValidationError';
    this.status = 400; // Bad Request
  }
}

module.exports = CustomValidationError;
