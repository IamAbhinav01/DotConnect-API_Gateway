import EnvConfiguration from '../config/env.config.js'

interface Argon2 {
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>
}

export class Argon2Configuration implements Argon2 {
  salt: Uint8Array
  timeCost: number
  memoryCost: number
  threads: number
  keyLength: number

  constructor() {
    this.salt = new Uint8Array(Number(EnvConfiguration.SALT_SIZE))

    this.timeCost = Number(EnvConfiguration.TIMECOST)
    this.memoryCost = Number(EnvConfiguration.MEMORYCOST)
    this.threads = Number(EnvConfiguration.THREADS)
    this.keyLength = Number(EnvConfiguration.KEYLENGTH)
  }

  async hashPassword(password: string): Promise<string> {
    throw new Error('Not implemented')
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    throw new Error('Not implemented')
  }
}
