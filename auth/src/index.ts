import express, { json } from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

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

const start = async () => {
  await mongoose
    .connect(`mongodb://auth-mongo-srv:27017/auth`)
    .then(() => {
      console.log(`Connected to mongoDB`);
      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    })
    .catch((err) => console.error(err));
};

start();
