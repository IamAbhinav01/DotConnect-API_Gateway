export interface CreateUserDto {
  username?: string
  email: string
  password: string
} // i had used it in the user creatiion crud repo

export interface UpdateUserDto {
  username?: string
  email?: string
} // i had used it in the user updation crud repo

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export interface UserResponseDto {
  id: string
  username?: string
  email: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginDto {
  email: string
  password: string
}
