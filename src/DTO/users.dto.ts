export interface CreateUserDto {
  username?: string
  email: string
  password: string
}

export interface UpdateUserDto {
  username?: string
  email?: string
}

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
