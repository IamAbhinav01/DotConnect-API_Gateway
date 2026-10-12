import type { Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { CreateUserDto, UserResponseDto } from '../DTO/users.dto.js'
import { GenerateJWTToken } from '../utils/jwt/jwt.utils.js'
import { userService } from '../services/user.Services.js'

export const userSignup = async (
  req: Request<ParamsDictionary, unknown, CreateUserDto>,
  res: Response
) => {
  const user: UserResponseDto = await userService.User_SignUp(req.body)
  GenerateJWTToken(res, user.id)
  return res.status(201).json({ user })
}
