// Handle errors with meaningful messages

class CustomNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;

    this.name="NotFoundError";
  };
};

module.exports = CustomNotFoundError;