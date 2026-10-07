import dotenv from 'dotenv';
dotenv.config();
const EnvConfiguration = {
    PORT: Number(process.env.PORT ?? 3000),
    LOG_LEVEL: process.env.LOG_LEVEL,
    MONGODB_URI: process.env.MONGODB_URI,
};
export default EnvConfiguration;
//# sourceMappingURL=env.config.js.map