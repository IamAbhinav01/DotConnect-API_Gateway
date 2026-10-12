import type { RequestHandler } from 'express'
import validator from 'validator'
import { BadRequestError } from '../utils/errors/application.error.js'

export const validateSignup: RequestHandler = (req, _res, next) => {
  const body: unknown = req.body
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return next(new BadRequestError('Request body must be a JSON object'))
  }

  const payload = body as Record<string, unknown>
  const { username, email, password } = payload

  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return next(new BadRequestError('A valid email address is required'))
  }

  if (typeof password !== 'string' || password.length < 8) {
    return next(
      new BadRequestError('Password must be at least 8 characters long')
    )
  }

  if (
    username !== undefined &&
    (typeof username !== 'string' ||
      username.trim().length < 3 ||
      username.trim().length > 30 ||
      !/^[a-zA-Z0-9_-]+$/.test(username.trim()))
  ) {
    return next(
      new BadRequestError(
        'Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens'
      )
    )
  }

  return next()
}
