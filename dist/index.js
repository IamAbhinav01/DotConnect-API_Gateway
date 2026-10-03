import express, {} from 'express';
import ServerConfiguration from './config/index.js';
const app = express();
app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Hello Pong!' });
});
app.listen(ServerConfiguration.EnvConfiguration.PORT, () => {
    console.log(`server started in port ${ServerConfiguration.EnvConfiguration.PORT}`);
});
//# sourceMappingURL=index.js.map