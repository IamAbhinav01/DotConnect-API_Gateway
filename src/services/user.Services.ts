import { UserRepository } from '../repositories/user.Repositories.js'

interface UserService {
  User_SignUp(): Promise<void>
  User_Login(): Promise<void>
  User_LogOut(): Promise<void>
}

const userRepository = new UserRepository()

async function userSignUp(): Promise<void> {
  // Use userRepository here
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
