import { UserRepository } from '../repositories/user.Repositories.js'

interface UserService {
  User_SignUp(): void
  User_Login(): void
  User_LogOut(): void
}
