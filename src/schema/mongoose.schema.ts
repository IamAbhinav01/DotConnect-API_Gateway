import mongoose, { Document, type InferSchemaType } from 'mongoose'
import validator from 'validator'

import { Style, Avatar } from '@dicebear/core'
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' }

const DieIcestyle = new Style(lorelei)

interface IUser extends Document {
  username?: string
  email: string
  password: string
  avatar: string
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [false, 'Not nesscery '],
      trim: true, // Removes leading/trailing whitespace
      lowercase: true, // Optional: makes usernames case-insensitive (highly recommended)
      minlength: [3, 'Username must be at least 3 characters long.'],
      maxlength: [30, 'Username cannot exceed 30 characters.'],
      validate: {
        // Regex ensures username only contains letters, numbers, underscores, or hyphens
        validator: function (v) {
          return /^[a-zA-Z0-9_-]+$/.test(v)
        },
        message:
          'Username can only contain alphanumeric characters, underscores, and hyphens.',
      },
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => {
          return validator.isEmail(v, {
            allow_display_name: false, // Rejects "John Doe <john@example.com>"
            require_tld: true, // Rejects "localhost" or "user@com"
          })
        },
        message: 'Please provide a valid email format.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

UserSchema.pre('validate', function (this: IUser) {
  if (!this.isModified('email') && this.avatar) {
    return Promise.resolve()
  }

  try {
    const avatar = new Avatar(DieIcestyle, {
      seed: this.email,
      size: 128,
    })
    this.avatar = avatar.toDataUri()

    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
})

export type UserType = InferSchemaType<typeof UserSchema>

export const User = mongoose.model('User', UserSchema)

export interface UserInput {
  username: string
  email: string
  password: string
}
