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
