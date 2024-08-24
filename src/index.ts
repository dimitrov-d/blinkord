import express from 'express';
import { actionCorsMiddleware } from '@solana/actions';
import { apiRouter } from './routers/api';

const app = express();
app.use(express.json());
app.use(actionCorsMiddleware({}));

app.get('/actions.json', (req, res) =>
  res.json({
    rules: [
      { pathPattern: '/*', apiPath: '/api/*' },
      { pathPattern: '/api/**', apiPath: '/api/**' },
    ],
  }),
);
app.use('/api', apiRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
