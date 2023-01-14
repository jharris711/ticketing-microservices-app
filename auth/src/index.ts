import express, { json } from 'express';
import 'express-async-errors';
import { errorHandler } from './middleware';
import {
  signinRouter,
  signoutRouter,
  signupRouter,
  currentUserRouter,
} from './routes';
import { NotFoundError } from './errors';

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

app.all(`*`, async (req, res) => {
  throw new NotFoundError();
});

/**
 * Error Handler
 */
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
