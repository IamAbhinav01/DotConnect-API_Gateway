import { getLogger } from './logger.config.js';
declare const ServerConfiguration: {
    DBConfiguration: string;
    EnvConfiguration: {
        PORT: number;
    };
    LoggerConfiguration: {
        getLogger: typeof getLogger;
    };
};
export default ServerConfiguration;
//# sourceMappingURL=index.d.ts.map