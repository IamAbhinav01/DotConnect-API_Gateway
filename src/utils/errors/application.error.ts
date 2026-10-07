import { StatusCodes } from 'http-status-codes'

class ApplicationError extends Error {
  public readonly statusCode: number
  constructor(name: string, message: string, statusCode: number) {
    super(message)

    this.name = name
    this.statusCode = statusCode

    Object.setPrototypeOf(this, new.target.prototype)

    // Cleaner stack trace (V8/Node only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class FailedConnection extends ApplicationError {
  constructor(
    message = 'Failed to establish connection to the server , check the connection link or api '
  ) {
    super('Failed-Connection', message, StatusCodes.BAD_GATEWAY)
  }
}
