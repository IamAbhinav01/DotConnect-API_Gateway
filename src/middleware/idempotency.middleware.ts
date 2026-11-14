import { type Request, type Response, type NextFunction } from 'express'
import { getLogger } from '../config/logger.config.js'
import { SERVICES } from '../utils/common/service_name.logger.utils.js'
import redis from '../config/redis.config.js'

const logger = getLogger(SERVICES.MIDDLEWARE)

interface CachedResponse {
  statusCode: number
  headers: Record<string, string>
  body: unknown
}

export const IdempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idempotencyKey = req.header('x-idempotency-key')
  if (!idempotencyKey || req.method == 'GET' || req.method == 'OPTIONS') {
    return next()
  }
  const userID = res.locals.userId
  const redisKey = `idempotency:${userID}:${idempotencyKey}`
  try {
    const redisSet = await redis.set(redisKey, 'IN_PROGRESS', 'EX', 60, 'NX')
    //in redis the output of redisSET is ok and null if it is ok if means value doesnot exsist and null means value exsist.
    if (!redisSet) {
      const valueExsists = await redis.get(redisKey)
      if (valueExsists == 'IN_PROGRESS') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'An identical request is currently processing. Please wait.',
        })
      }
      if (valueExsists) {
        const cachedResponse: CachedResponse = JSON.parse(valueExsists)
        res.setHeader('x-cache-lookup', 'HIT-IDEMPOTENT')
        res.status(cachedResponse.statusCode).json(cachedResponse.body)
        return res
      }
    }
    const originalJson = res.json.bind(res)
    res.json = (body: unknown): Response => {
      // Only cache successful mutations (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const payload: CachedResponse = {
          statusCode: res.statusCode,
          headers: { 'content-type': 'application/json' },
          body,
        }
        // Save to Redis for 24 hours (86400 seconds)
        redis
          .set(redisKey, JSON.stringify(payload), 'EX', 86400)
          .catch(console.error)
      } else {
        // If operation failed (4xx, 5xx), release the lock so the user can retry
        redis.del(redisKey).catch(console.error)
      }
      return originalJson(body)
    }
    next()
  } catch (err) {
    logger.error(`error occured while checking the idempotency : ${err}`)
    next()
  }
}
