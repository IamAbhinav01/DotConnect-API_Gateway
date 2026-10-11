export const SERVICES = Object.freeze({
  CONTROLLER: 'controller',
  REPOSITORY: 'repository',
  SERVICE: 'service',
  UTILS: 'utils',
  ERRORS: 'errors',
  MIDDLEWARE: 'middleware',
  DATABASE: 'database-layer',
  SECURITY: 'argon2-layer',
  ROUTER: 'router',
  MAIN: 'main-server',
} as const)

export type ServiceName = (typeof SERVICES)[keyof typeof SERVICES]
