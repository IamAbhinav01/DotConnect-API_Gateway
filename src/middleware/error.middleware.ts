import type { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getLogger } from '../config/logger.config.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'
import { ApplicationError } from '../utils/errors/application.error.js'

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  )
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next
) => {
  void _next
  getLogger(SERVICES.MIDDLEWARE).error('Request failed', error)

  if (isDuplicateKeyError(error)) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: 'An account with this email already exists' })
  }

  if (error instanceof ApplicationError) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal server error' })
}
