import { getLogger } from '../config/logger.config.js'
import type {
  CreateUserDto,
  LoginDto,
  UserResponseDto,
} from '../DTO/users.dto.js'
import { Argon2Configuration } from '../security/argon2.Security.js'
import { UserRepository } from '../repositories/user.Repositories.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors/application.error.js'
import mongoose from 'mongoose'
import type { UserRole } from '../DTO/users.dto.js'

const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,p=4,t=2$bnxE4QYFMyyBxfwGlLSsCQ$Ux28E9YwD/PUfVQYi1kbUIrYlAYqXG7tDL5n3oFNdt0'

interface UserService {
  User_SignUp(payload: CreateUserDto): Promise<UserResponseDto>
  User_Login(payload: LoginDto): Promise<UserResponseDto>
  User_CurrentUser(userId: string): Promise<UserResponseDto>

  Admin_ListUsers(): Promise<UserResponseDto[]>
  Admin_DeleteUser(userId: string): Promise<void>
  Admin_PromoteUser(userId: string): Promise<UserResponseDto>
}

const userRepository = new UserRepository()
const passwordSecurity = new Argon2Configuration()

function toUserResponse(
  user: Awaited<ReturnType<UserRepository['create']>>
): UserResponseDto {
  return {
    id: user._id.toString(),
    ...(user.username == null ? {} : { username: user.username }),
    email: user.email,
    avatar: user.avatar,
    role: user.role as UserRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

async function userSignUp(payload: CreateUserDto): Promise<UserResponseDto> {
  const user = await userRepository.create(payload)
  getLogger(SERVICES.SERVICE).info(
    'Successfully created user through the user repository'
  )
  return toUserResponse(user)
}

async function userLogin(payload: LoginDto): Promise<UserResponseDto> {
  const user = await userRepository.findByEmail(
    payload.email.trim().toLowerCase()
  )
  const passwordMatches = await passwordSecurity.verifyPassword(
    payload.password,
    user?.password ?? DUMMY_PASSWORD_HASH
  )

  if (!user || !passwordMatches) {
    throw new UnauthorizedError('Invalid email or password')
  }

  getLogger(SERVICES.SERVICE).info('Successfully authenticated user')
  return toUserResponse(user)
}

async function userCurrentUser(userId: string): Promise<UserResponseDto> {
  const user = await userRepository.findByID(userId)
  if (!user) {
    throw new UnauthorizedError()
  }

  return toUserResponse(user)
}

async function adminListUsers(): Promise<UserResponseDto[]> {
  const users = await userRepository.findAll()
  return users.map(toUserResponse)
}

async function adminDeleteUser(userId: string): Promise<void> {
  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('Invalid user ID')
  }

  const deletedUser = await userRepository.delete(userId)
  if (!deletedUser) {
    throw new NotFoundError('User not found')
  }
}

async function adminPromoteUser(userId: string): Promise<UserResponseDto> {
  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('Invalid user ID')
  }

  const user = await userRepository.promoteToAdmin(userId)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  return toUserResponse(user)
}

export const userService = {
  User_SignUp: userSignUp,
  User_Login: userLogin,
  User_CurrentUser: userCurrentUser,
  Admin_ListUsers: adminListUsers,
  Admin_DeleteUser: adminDeleteUser,
  Admin_PromoteUser: adminPromoteUser,
} satisfies UserService
//satisfies UserService checks that the object has the required methods with compatible signatures.
