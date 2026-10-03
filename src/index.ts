import express, { type Request, type Response } from 'express';
import ServerConfiguration from './config/index.js';

const app = express();

app.get('/ping', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Hello Pong!' });
});

app.listen(ServerConfiguration.EnvConfiguration.PORT, () => {
  console.log(`server started in port ${ServerConfiguration.EnvConfiguration.PORT}`);
});
