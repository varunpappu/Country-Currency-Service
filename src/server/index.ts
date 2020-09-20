import * as express from 'express';
import router from './routes/routes';
import * as cors from 'cors';

const startService = () => {
  const app = express();
  const port = 8080;
  app.use(cors({ origin: true, credentials: true }));
  app.use(router);

  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
  });
};

startService();
