import { getLogger } from '../config/logger.config.js'
import type { CreateUserDto } from '../DTO/users.dto.js'
import { UserRepository } from '../repositories/user.Repositories.js'
import { Argon2Configuration } from '../security/argon2.Security.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'
import { AuthSignUpError } from '../utils/errors/application.error.js'

interface UserService {
  User_SignUp(payload: CreateUserDto): Promise<void>
  User_Login(): Promise<void>
  User_LogOut(): Promise<void>
}

const userRepository = new UserRepository()
const cfg = new Argon2Configuration()

async function userSignUp(payload: CreateUserDto): Promise<void> {
  try {
    userRepository.create(payload)
    getLogger(SERVICES.SERVICE).info(
      'Succesfully sent payload of signing to the userRepository'
    )
  } catch (error) {
    getLogger(SERVICES.SERVICE).error(
      'Error occured while working on signing up the user',
      error
    )
    throw new AuthSignUpError('Error occured while SignUp User')
  }
}

async function userLogin(): Promise<void> {
  // Implement login here
}

async function userLogOut(): Promise<void> {
  // Implement logout here
}

export const userService = {
  User_SignUp: userSignUp,
  User_Login: userLogin,
  User_LogOut: userLogOut,
} satisfies UserService
//satisfies UserService checks that the object has the required methods with compatible signatures.
