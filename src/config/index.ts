import EnvConfiguration from './env.config.js'
import { getLogger } from './logger.config.js'

const ServerConfiguration = {
  DBConfiguration: './db.config.ts',
  EnvConfiguration,
  LoggerConfiguration: { getLogger },
}

export default ServerConfiguration
