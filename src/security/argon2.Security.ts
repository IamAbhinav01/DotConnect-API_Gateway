import { randomFillSync } from 'node:crypto'
import EnvConfiguration from '../config/env.config.js'
import { getLogger } from '../config/logger.config.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'

import * as argon2 from 'argon2'

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
    this.salt = new Uint8Array(0)
    this.timeCost = Number(EnvConfiguration.TIMECOST)
    this.memoryCost = Number(EnvConfiguration.MEMORYCOST)
    this.threads = Number(EnvConfiguration.THREADS)
    this.keyLength = Number(EnvConfiguration.KEYLENGTH)
  }

  saltGeneration(saltSize: number): Uint8Array {
    const salt = new Uint8Array(saltSize)
    randomFillSync(salt)
    getLogger(SERVICES.SECURITY).info(
      'Succesully randomfly generated value in the buffer salt'
    )
    return salt
  }

  async hashPassword(password: string): Promise<string> {
    try {
      this.salt = this.saltGeneration(Number(EnvConfiguration.SALT_SIZE))
      const encodedHash = await argon2.hash(password, {
        salt: Buffer.from(
          this.salt.buffer,
          this.salt.byteOffset,
          this.salt.byteLength
        ),
        timeCost: this.timeCost,
        memoryCost: this.memoryCost,
        parallelism: this.threads,
        hashLength: this.keyLength,
        type: argon2.argon2id,
      })
      getLogger(SERVICES.SECURITY).info('Succesfully encoded the hash')
      return encodedHash
    } catch (error) {
      getLogger(SERVICES.SECURITY).error(
        'Error occurred while hashing password',
        error
      )
      throw error
    }
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password)
    } catch (err) {
      getLogger(SERVICES.SECURITY).error('Error verification failed', err)
      return false
    }
  }
}
