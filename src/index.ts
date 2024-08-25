import express from 'express';
import { apiRouter } from './routers/api';
import { initializeDatabase } from './database/database';

const app = express();
app.use(express.json());
initializeDatabase();

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
