import type { RequestHandler } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import jwt from 'jsonwebtoken'
import EnvConfiguration from '../config/env.config.js'
import {
  ForbiddenError,
  UnauthorizedError,
} from '../utils/errors/application.error.js'
import { User } from '../schema/mongoose.schema.js'
import { USER_ROLES, type UserRole } from '../DTO/users.dto.js'

export interface AuthenticatedLocals extends Record<string, unknown> {
  userId: string
  role: UserRole
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

  let payload: string | jwt.JwtPayload
  try {
    payload = jwt.verify(token, secret, { algorithms: ['HS256'] })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid or expired token'))
    }
    return next(error)
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.userId !== 'string'
  ) {
    return next(new UnauthorizedError('Invalid or expired token'))
  }

  void User.findById(payload.userId)
    .select('role')
    .exec()
    .then((user) => {
      if (!user || !USER_ROLES.includes(user.role)) {
        return next(new UnauthorizedError('Invalid or expired token'))
      }

      res.locals.userId = user.id
      res.locals.role = user.role
      return next()
    })
    .catch(next)
}

export const requireAdmin: RequestHandler<
  ParamsDictionary,
  unknown,
  unknown,
  unknown,
  AuthenticatedLocals
> = (_req, res, next) => {
  if (res.locals.role !== 'admin') {
    return next(new ForbiddenError())
  }
  return next()
}
