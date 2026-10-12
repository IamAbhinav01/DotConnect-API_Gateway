import { getLogger } from '../config/logger.config.js'
import type {
  CreateUserDto,
  LoginDto,
  UserResponseDto,
} from '../DTO/users.dto.js'
import { Argon2Configuration } from '../security/argon2.Security.js'
import { UserRepository } from '../repositories/user.Repositories.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'
import { UnauthorizedError } from '../utils/errors/application.error.js'

interface UserService {
  User_SignUp(payload: CreateUserDto): Promise<UserResponseDto>
  User_Login(payload: LoginDto): Promise<UserResponseDto>
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
  if (
    !user ||
    !(await passwordSecurity.verifyPassword(payload.password, user.password))
  ) {
    throw new UnauthorizedError('Invalid email or password')
  }

  getLogger(SERVICES.SERVICE).info('Successfully authenticated user')
  return toUserResponse(user)
}

export const userService = {
  User_SignUp: userSignUp,
  User_Login: userLogin,
} satisfies UserService
//satisfies UserService checks that the object has the required methods with compatible signatures.
