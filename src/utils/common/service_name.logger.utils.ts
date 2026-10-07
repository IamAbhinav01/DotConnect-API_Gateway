export const SERVICES = Object.freeze({
  CONTROLLER: 'controller',
  REPOSITORY: 'repository',
  SERVICE: 'service',
  UTILS: 'utils',
  ERRORS: 'errors',
  MIDDLEWARE: 'middleware',
  ROUTER: 'router',
  MAIN: 'main-server',
} as const)

export type ServiceName = (typeof SERVICES)[keyof typeof SERVICES]
