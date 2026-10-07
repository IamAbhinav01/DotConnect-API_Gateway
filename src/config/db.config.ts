import mongoose from 'mongoose'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'
import { FailedConnection } from '../utils/errors/application.error.js'
import EnvConfiguration from './env.config.js'
import { getLogger } from './logger.config.js'

const logger = getLogger(SERVICES.DATABASE)

export async function connectToDB() {
  const uri = EnvConfiguration.MONGODB_URI

  if (!uri) {
    logger.error('error occured while setting up mongoDB uri')
    throw new FailedConnection('Error occured while setting up the mongoDB-URI')
  }

  await mongoose.connect(uri)

  logger.info('Connected to MongoDB')
}
