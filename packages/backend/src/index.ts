import express, { Request, Response } from 'express';
import { apiRouter } from './routers/api';
import { initializeDatabase } from './database/database';
import { discordRouter } from './routers/discord';
import helmet from 'helmet';
import { actionCorsMiddleware } from '@solana/actions';
require('console-stamp')(console, 'dd/mm/yyyy HH:MM:ss');

initializeDatabase();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(actionCorsMiddleware({}));

app.get('/actions.json', (req: Request, res: Response) =>
  res.json({
    rules: [
      { pathPattern: '/', apiPath: '/api/' },
      { pathPattern: '/api/*', apiPath: 'https://blinkord.onrender.com/api/*' },
    ],
  }),
);

app.use('/api', apiRouter);
app.use('/discord', discordRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
