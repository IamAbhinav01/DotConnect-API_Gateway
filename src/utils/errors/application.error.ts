import { StatusCodes } from 'http-status-codes'

export class ApplicationError extends Error {
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

export class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super('BAD-REQUEST', message, StatusCodes.BAD_REQUEST)
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message, StatusCodes.UNAUTHORIZED)
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = 'Insufficient permissions') {
    super('FORBIDDEN', message, StatusCodes.FORBIDDEN)
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found') {
    super('NOT-FOUND', message, StatusCodes.NOT_FOUND)
  }
}

export class FailedConnection extends ApplicationError {
  constructor(
    message = 'Failed to establish connection to the server , check the connection link or api '
  ) {
    super('Failed-Connection', message, StatusCodes.BAD_GATEWAY)
  }
}

export class AuthSignUpError extends ApplicationError {
  constructor(
    message = 'Error occured after response transfered to the service layer'
  ) {
    super('INTERNAL-SERVER-ERROR', message, StatusCodes.INTERNAL_SERVER_ERROR)
  }
}
