import type { RequestHandler } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import jwt from 'jsonwebtoken'
import EnvConfiguration from '../config/env.config.js'
import { UnauthorizedError } from '../utils/errors/application.error.js'

export interface AuthenticatedLocals extends Record<string, unknown> {
  userId: string
}

export const verifyJWT: RequestHandler<
  ParamsDictionary,
  unknown,
  unknown,
  unknown,
  AuthenticatedLocals
> = (req, res, next) => {
  const token: unknown = req.cookies?.jwt
  if (typeof token !== 'string' || token.length === 0) {
    return next(new UnauthorizedError())
  }

  const secret = EnvConfiguration.JWT_SECRET
  if (!secret) {
    return next(new Error('JWT_SECRET environment variable is required'))
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] })
    if (
      typeof payload !== 'object' ||
      payload === null ||
      typeof payload.userId !== 'string'
    ) {
      return next(new UnauthorizedError('Invalid or expired token'))
    }

    res.locals.userId = payload.userId
    return next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid or expired token'))
    }
    return next(error)
  }
}
