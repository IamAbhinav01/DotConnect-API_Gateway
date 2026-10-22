export const USER_ROLES = ['user', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

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
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface FindUserResponseDTO {
  id: string
  username?: string
  email: string
  avatar: string
}

export interface LoginDto {
  email: string
  password: string
}
