import jwt from 'jsonwebtoken'
import { type Response } from 'express'
import EnvConfiguration from '../../config/env.config.js'

const jwtCookieOptions = {
  httpOnly: true,
  secure: EnvConfiguration.NODE_ENV === 'production',
  sameSite: 'strict' as const,
}

export const GenerateJWTToken = (res: Response, userId: string) => {
  const jwtSecret = EnvConfiguration.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required')
  }

  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' })

  res.cookie('jwt', token, {
    ...jwtCookieOptions,
    maxAge: 60 * 60 * 1000,
  })
}

export const clearToken = (res: Response) => {
  res.cookie('jwt', '', {
    ...jwtCookieOptions,
    expires: new Date(0),
  })
}

export const GenerateInternalToken = (userId: string, role: string): string => {
  const internalSecret = EnvConfiguration.INTERNAL_SECRET

  if (!internalSecret) {
    throw new Error('INTERNAL_SECRET environment variable is required')
  }

  const token = jwt.sign(
    { userId, role, iss: 'api-gateway', aud: 'dotconnect-go-service' },
    internalSecret,
    { expiresIn: '2m' }
  )

  return token
}
