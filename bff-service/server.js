import Express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { cachedResponseMiddleware, cacheMiddleware } from './middlewares';
import { getServiceUrl } from './utils';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded());

app.use(cachedResponseMiddleware);

app.all('/:serviceName*', (req, res, next) => {
  try {
    const { serviceName } = req.params;
    const serviceUrl = getServiceUrl(serviceName);
    const servicePath = req.originalUrl.replace(`/${serviceName}`, '');
    const recipientUrl = `${serviceUrl}${servicePath}`;

    axios({
      method: req.method,
      url: recipientUrl,
      headers: { ...req.headers, host: '' },
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    })
      .then(r => {
        req.serviceResponse = r;
        next();
      })
      .catch(e => next(e));
  } catch (e) {
    next(e);
  }
});

app.use(cacheMiddleware);

app.use((req, res, next) => {
  const response = req.serviceResponse;
  if (!response) return next(new Error('Error'));
  return res.set(response.headers).status(response.status).json(response.data);
});

app.use((error, req, res, next) => {
  if (!error.response) return res.status(500).json({ error: error.message });
  const { headers, status, data } = error.response;
  return res.set(headers).status(status).json(data);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
