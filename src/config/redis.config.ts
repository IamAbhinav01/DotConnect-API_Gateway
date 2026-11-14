import { Redis } from 'ioredis'
import EnvConfiguration from './env.config.js'
import { getLogger } from './logger.config.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'

const logger = getLogger(SERVICES.REDIS)

const redis = new Redis({
  host: EnvConfiguration.REDIS_HOST,
  port: Number(EnvConfiguration.REDIS_PORT),
})

redis.on('connect', () => {
  logger.info(`Redis Connected to ${Number(EnvConfiguration.REDIS_PORT)}`)
})
redis.on('error', () => {
  logger.error('error occured while connecting to redis')
})

export default redis
