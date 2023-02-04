import mongoose from 'mongoose';
import app from './app';

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

const start = async () => {
  console.log(`Starting up...`);
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key must be defined');
  }
  if (!mongoURI) {
    throw new Error(`MONGO_URI must be defined`);
  }
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log(`Connected to mongoDB`);
      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    })
    .catch((err) => console.error(err));
};

start();
