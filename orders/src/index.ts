import mongoose from 'mongoose';
import app from './app';
import natsWrapper from './natsWrapper';
import {
  TicketCreatedListener,
  TicketUpdatedListener,
  ExpirationCompleteListener,
  PaymentCreatedListener,
} from './events/listeners';

const port = process.env.PORT || 3000;
const jwtKey = process.env.JWT_KEY;
const mongoURI = process.env.MONGO_URI;
const natsClientId = process.env.NATS_CLIENT_ID;
const natsUrl = process.env.NATS_URL;
const natsClusterId = process.env.NATS_CLUSTER_URL;

const start = async () => {
  console.log('*** Starting orders service...');
  if (!jwtKey) {
    throw new Error('JWT key must be defined');
  }
  if (!mongoURI) {
    throw new Error(`MONGO_URI must be defined`);
  }
  if (!natsClientId) {
    throw new Error(`MONGO_URI must be defined`);
  }
  if (!natsUrl) {
    throw new Error(`MONGO_URI must be defined`);
  }
  if (!natsClusterId) {
    throw new Error(`MONGO_URI must be defined`);
  }

  /**
   * NATS
   */
  await natsWrapper
    .connect(natsClusterId, natsClientId, natsUrl)
    .then(() => {
      console.log(`Connected to NATS`);
    })
    .catch((err) => console.error(err));
  natsWrapper.client.on(`close`, () => {
    console.log(`NATS conection closed`);
    process.exit();
  });
  process.on(`SIGINT`, () => {
    natsWrapper.client.close();
  });
  process.on(`SIGTERM`, () => {
    natsWrapper.client.close();
  });

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();
  new PaymentCreatedListener(natsWrapper.client).listen();

  /**
   * Mongoose
   */
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
