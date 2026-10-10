import type { HydratedDocument, Model } from 'mongoose'

interface IOperations<
  T,
  TCreate extends Partial<T>,
  TUpdate extends Partial<T>,
> {
  create(data: TCreate): Promise<HydratedDocument<T>>
  findByID(id: string): Promise<HydratedDocument<T> | null>
  //   findAll(): Promise<HydratedDocument<T>[]>
  updateByID(id: string, data: TUpdate): Promise<HydratedDocument<T> | null>
  delete(id: string): Promise<HydratedDocument<T> | null>
}

export class CrudOperations<
  T,
  TCreate extends Partial<T>,
  TUpdate extends Partial<T> = TCreate,
> implements IOperations<T, TCreate, TUpdate> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: TCreate): Promise<HydratedDocument<T>> {
    return this.model.create(data)
  }

  async findByID(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).exec()
  }

  //   async findAll(): Promise<HydratedDocument<T>[]> {
  //     return this.model.find({}).exec()
  //   }

  //   async findAllPublic(): Promise<Array<Pick<UserType, 'username' | 'avatar'>>> {
  //     const users = await this.model.find({}).select('username avatar').exec()

  //     return users.map(({ username, avatar }) => ({
  //       ...(username === undefined ? {} : { username }),
  //       avatar,
  //     }))
  //   }

  async updateByID(
    id: string,
    data: TUpdate
  ): Promise<HydratedDocument<T> | null> {
    const document = await this.model.findById(id).exec()
    if (!document) {
      return null
    }
    document.set(data)
    await document.save()
    return document
  }

  async delete(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id).exec()
  }
}
