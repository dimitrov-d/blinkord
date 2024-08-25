import express, { Request, Response } from 'express';
import { apiRouter } from './routers/api';
import { initializeDatabase } from './database/database';
import { discordRouter } from './routers/discord';
require('console-stamp')(console, 'dd/mm/yyyy HH:MM:ss');

const app = express();
app.use(express.json());
initializeDatabase();

app.get('/actions.json', (req: Request, res: Response) =>
  res.json({
    rules: [
      { pathPattern: '/*', apiPath: '/api/*' },
      { pathPattern: '/api/**', apiPath: '/api/**' },
    ],
  }),
);
app.use('/api', apiRouter);
app.use('/discord', discordRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
