import type { HydratedDocument } from 'mongoose'
import {
  User,
  type UserInput,
  type UserType,
} from '../schema/mongoose.schema.js'
import { CrudOperations } from './crud.Repository.js'

export class UserRepository extends CrudOperations<UserType, UserInput> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string): Promise<HydratedDocument<UserType> | null> {
    return this.model.findOne({ email }).exec()
  }
}
