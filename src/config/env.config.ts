import dotenv from 'dotenv'
dotenv.config()

const EnvConfiguration = {
  PORT: Number(process.env.PORT ?? 3000),
  LOG_LEVEL: process.env.LOG_LEVEL,
  MONGODB_URI: process.env.MONGODB_URI,
  SALT_SIZE: process.env.salt_size,
  TIMECOST: process.env.TimeCost,
  MEMORYCOST: process.env.MemoryCost,
  THREADS: process.env.Threads,
  KEYLENGTH: process.env.KeyLength,
}

export default EnvConfiguration
