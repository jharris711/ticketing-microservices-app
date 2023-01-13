import express, { json } from 'express';
import { currentUserRouter } from './routes/currentUser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
