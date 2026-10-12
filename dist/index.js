import express, {} from 'express';
import { SERVICES } from './utils/common/service_name.logger.utils.js';
import EnvConfiguration from './config/env.config.js';
import { getLogger } from './config/logger.config.js';
import { connectToDB } from './config/db.config.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
const app = express();
app.use(express.json());
app.use('/api', apiRouter);
app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Hello Pong!' });
});
app.use(errorHandler);
await connectToDB();
app.listen(EnvConfiguration.PORT, () => {
    getLogger(SERVICES.MAIN).info(`Server listening on port ${EnvConfiguration.PORT}`);
});
//# sourceMappingURL=index.js.map