import type { HydratedDocument } from 'mongoose'
import type { CreateUserDto, UpdateUserDto } from '../DTO/users.dto.js'
import { User, type UserType } from '../schema/mongoose.schema.js'
import { CrudOperations } from './crud.Repository.js'

export class UserRepository extends CrudOperations<
  UserType,
  CreateUserDto,
  UpdateUserDto
> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string): Promise<HydratedDocument<UserType> | null> {
    return this.model.findOne({ email }).select('+password').exec()
  }

  async findAll(): Promise<HydratedDocument<UserType>[]> {
    return this.model.find({}).exec()
  }

  async promoteToAdmin(id: string): Promise<HydratedDocument<UserType> | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { role: 'admin' },
        { new: true, runValidators: true }
      )
      .exec()
  }
}
