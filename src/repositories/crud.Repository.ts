import type { Document, Model } from 'mongoose'

interface IOperations<T> {
  create(data: Partial<T>): Partial<T>
  findUserByID(): void
}

export class CrudOperations<T extends Document> implements IOperations<T> {
  constructor(protected model: Model<T>) {}
  async create(data: Partial<T>): Partial<T> {}
}
