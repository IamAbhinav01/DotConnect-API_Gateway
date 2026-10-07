import express, {} from 'express';
import { SERVICES } from './utils/common/service_name.logger.utils.js';
import EnvConfiguration from './config/env.config.js';
import { getLogger } from './config/logger.config.js';
import { connectToDB } from './config/db.config.js';
const app = express();
app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Hello Pong!' });
});
await connectToDB();
app.listen(EnvConfiguration.PORT, () => {
    getLogger(SERVICES.MAIN).info(`Server listening on port ${EnvConfiguration.PORT}`);
});
//# sourceMappingURL=index.js.map