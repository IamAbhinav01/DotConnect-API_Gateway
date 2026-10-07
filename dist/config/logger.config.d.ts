import winston from 'winston';
import 'winston-daily-rotate-file';
import { type ServiceName } from '../utils/common/service_name.logger.utils.js';
declare const baseLogger: winston.Logger;
/**
 * Get a logger bound to a service name.
 * Every log entry from it automatically includes { service: '<name>' }.
 */
export declare function getLogger(service: ServiceName): winston.Logger;
export default baseLogger;
//# sourceMappingURL=logger.config.d.ts.map