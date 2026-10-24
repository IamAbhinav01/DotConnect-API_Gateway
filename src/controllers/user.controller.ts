import type { Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type {
  CreateUserDto,
  LoginDto,
  UserResponseDto,
} from '../DTO/users.dto.js'
import { clearToken, GenerateJWTToken } from '../utils/jwt/jwt.utils.js'
import type { AuthenticatedLocals } from '../middleware/auth.middleware.js'
import { userService } from '../services/user.Services.js'
import mongoose from 'mongoose'

export const userSignup = async (
  req: Request<ParamsDictionary, unknown, CreateUserDto>,
  res: Response
) => {
  const user: UserResponseDto = await userService.User_SignUp(req.body)
  GenerateJWTToken(res, user.id)
  return res.status(201).json({ user })
}

export const userLogin = async (
  req: Request<ParamsDictionary, unknown, LoginDto>,
  res: Response
) => {
  const user: UserResponseDto = await userService.User_Login(req.body)
  GenerateJWTToken(res, user.id)
  return res.status(200).json({ user })
}

export const userLogout = (_req: Request, res: Response) => {
  clearToken(res)
  return res.status(200).json({ message: 'Logged out successfully' })
}

export const getCurrentUser = async (
  _req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  const user: UserResponseDto = await userService.User_CurrentUser(
    res.locals.userId
  )
  return res.status(200).json({ user })
}

export const findUserById = async (
  req: Request<{ userId: string }>,
  res: Response<unknown, AuthenticatedLocals>
) => {
  const user: UserResponseDto = await userService.User_CurrentUser(
    req.params.userId
  )
  return res.status(200).json({ user })
}

export const listUsers = async (_req: Request, res: Response) => {
  const users: UserResponseDto[] = await userService.Admin_ListUsers()
  return res.status(200).json({ users })
}

export const deleteUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  await userService.Admin_DeleteUser(req.params.userId)
  return res.status(200).json({ message: 'User deleted successfully' })
}

export const promoteUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const user: UserResponseDto = await userService.Admin_PromoteUser(
    req.params.userId
  )
  return res.status(200).json({ user })
}
export const searchUsers = async (req: Request, res: Response) => {
  const q = String(req.query.q ?? '').trim()
  if (q.length < 2) {
    return res.status(200).json({ users: [] })
  }
  const users = await userService.User_Search(q)
  return res.status(200).json({ users })
}
export const getAvatar = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(400).json({ message: 'Invalid user ID' })
  }
  const avatar = await userService.Get_Avatar(req.params.userId)
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  const [metadata, data] = avatar.split(',', 2)
  if (metadata && data) {
    const isBase64 = metadata.includes(';base64')
    const svg = isBase64
      ? Buffer.from(data, 'base64').toString('utf-8')
      : decodeURIComponent(data)
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.status(200).send(svg)
  }
  return res.redirect(avatar)
}
