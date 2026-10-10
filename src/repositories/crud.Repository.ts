import type { HydratedDocument, Model } from 'mongoose'

interface IOperations<T, TCreate extends Partial<T>> {
  create(data: TCreate): Promise<HydratedDocument<T>>
  findByID(id: string): Promise<HydratedDocument<T> | null>
  findAll(): Promise<HydratedDocument<T>[]>
  delete(): void
  updateByID(id: string, data: TCreate): Promise<HydratedDocument<T> | null>
}

export class CrudOperations<
  T,
  TCreate extends Partial<T>,
> implements IOperations<T, TCreate> {
  constructor(protected model: Model<T>) {}

  async create(data: TCreate): Promise<HydratedDocument<T>> {
    return this.model.create(data)
  }

  async findByID(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).exec()
  }

  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.model.find({}).exec()
  }

  async updateByID(
    id: string,
    data: TCreate
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec()
  }
}
