import winston from 'winston'
import 'winston-daily-rotate-file'
import {
  type ServiceName,
  SERVICES,
} from '../utils/common/service_name.logger.utils.js'

const { combine, timestamp, json, colorize, printf, errors } = winston.format
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  zippedArchive: true,
  symlinkName: 'application.log',
  createSymlink: true,
})

const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize(),
    printf(
      ({ timestamp, level, service, message, stack }) =>
        `${timestamp} [${service || 'app'}] ${level}: ${stack || message}`
    )
  ),
})

const baseLogger = winston.createLogger({
  level: LOG_LEVEL,
  // errors() makes Error objects log message + stack properly
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [fileRotateTransport, consoleTransport],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
})

/**
 * Get a logger bound to a service name.
 * Every log entry from it automatically includes { service: '<name>' }.
 */
export function getLogger(service: ServiceName) {
  if (service == undefined || service == null) {
    return baseLogger
  }
  if (!Object.values(SERVICES).includes(service)) {
    throw new Error(
      `Unknown logger service "${service}". Use one of: ${Object.values(SERVICES).join(', ')}`
    )
  }
  return baseLogger.child({ service })
}

export default baseLogger
