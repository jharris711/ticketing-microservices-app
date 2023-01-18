import express, { json } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from './middleware';
import {
  signinRouter,
  signoutRouter,
  signupRouter,
  currentUserRouter,
} from './routes';
import { NotFoundError } from './errors';

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

/**
 * Routes
 */
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all(`*`, async (req, res) => {
  throw new NotFoundError();
});

/**
 * Error Handler
 */
app.use(errorHandler);

export default app;
