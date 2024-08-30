import express, { Request, Response } from 'express';
import { blinksRouter } from './routers/api';
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
app.use((req, res, next) => {
  // Redirect API URL to website
  if (req.hostname === 'api.blinkord.com') {
    return res.redirect(301, 'https://blinkord.com');
  }
  next();
});

app.get('/actions.json', (req: Request, res: Response) =>
  res.json({
    rules: [
      { pathPattern: '/', apiPath: '/blinks/' },
      { pathPattern: '/blinks/**', apiPath: 'https://api.blinkord.com/blinks/**' },
    ],
  }),
);

app.use('/blinks', blinksRouter);
app.use('/discord', discordRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
