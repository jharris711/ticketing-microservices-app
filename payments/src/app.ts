import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, currentUser, NotFoundError } from '@jheezytix/common';
import { createChargeRouter } from './routes/new';

/**
 * App setup
 */
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== `test`,
  })
);
app.use(currentUser);

/**
 * Routes
 */
app.use(createChargeRouter);

app.all(`*`, async (req, res) => {
  throw new NotFoundError();
});

/**
 * Error Handler
 */
app.use(errorHandler);

export default app;
