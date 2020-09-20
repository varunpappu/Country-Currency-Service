import * as express from 'express';
import PublicRoutes from './public-routes';
import { httpCodes } from '../constants/http-codes';
import * as swaggerDoc from '../docs/swagger.json';
import * as swaggerUi from 'swagger-ui-express';

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

PublicRoutes.register(router);

router.all('*', (req, res) => {
  const errorInfo = {
    status: httpCodes.BadRequest,
    message: `Bad Request. ${req.method} ::: ${req.protocol}://${req.get('host')}${req.originalUrl}`,
    source: 'Country-Currency-Service',
  };

  res.status(httpCodes.BadRequest).send(errorInfo);
});

export default router;
