import jwt from 'jsonwebtoken'
import { type Response } from 'express'
import EnvConfiguration from '../../config/env.config.js'

export const GenerateJWTToken = (res: Response, userId: string) => {
  const jwtSecret = EnvConfiguration.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required')
  }

  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' })

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  })
}

export const clearToken = (res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
}
