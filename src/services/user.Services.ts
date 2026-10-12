import { getLogger } from '../config/logger.config.js'
import type { CreateUserDto, UserResponseDto } from '../DTO/users.dto.js'
import { UserRepository } from '../repositories/user.Repositories.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'

interface UserService {
  User_SignUp(payload: CreateUserDto): Promise<UserResponseDto>
  User_Login(): Promise<void>
  User_LogOut(): Promise<void>
}

const userRepository = new UserRepository()

async function userSignUp(payload: CreateUserDto): Promise<UserResponseDto> {
  const user = await userRepository.create(payload)
  getLogger(SERVICES.SERVICE).info(
    'Successfully created user through the user repository'
  )
  return {
    id: user._id.toString(),
    ...(user.username == null ? {} : { username: user.username }),
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

async function userLogin(): Promise<void> {}

async function userLogOut(): Promise<void> {
  // Implement logout here
}

export const userService = {
  User_SignUp: userSignUp,
  User_Login: userLogin,
  User_LogOut: userLogOut,
} satisfies UserService
//satisfies UserService checks that the object has the required methods with compatible signatures.
