import express, {} from 'express';
import ServerConfiguration from './config/index.js';
import { SERVICES } from './utils/common/service_name.logger.utils.js';
const app = express();
app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Hello Pong!' });
});
app.listen(ServerConfiguration.EnvConfiguration.PORT, () => {
    ServerConfiguration.LoggerConfiguration.getLogger(SERVICES.MAIN).info(`Server listening on port ${ServerConfiguration.EnvConfiguration.PORT}`);
});
//# sourceMappingURL=index.js.map