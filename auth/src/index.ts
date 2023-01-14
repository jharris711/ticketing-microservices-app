import express, { json } from 'express';
import { errorHandler } from './middleware';
import {
  signinRouter,
  signoutRouter,
  signupRouter,
  currentUserRouter,
} from './routes';

const port = process.env.PORT || 3000;

/**
 * App setup
 */
const app = express();
app.use(json());

/**
 * Routes
 */
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

/**
 * Middleware
 */
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
