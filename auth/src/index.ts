import mongoose from 'mongoose';
import app from './app';

const port = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key must be defined');
  }
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
