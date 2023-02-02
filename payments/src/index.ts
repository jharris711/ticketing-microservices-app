import mongoose from 'mongoose';
import app from './app';
import natsWrapper from './natsWrapper';
import OrderCancelledListener from './events/listeners/orderCancelledListener';
import OrderCreatedListener from './events/listeners/orderCreatedListener';

const port = process.env.PORT || 3000;
const jwtKey = process.env.JWT_KEY;
const mongoURI = process.env.MONGO_URI;
const natsClientId = process.env.NATS_CLIENT_ID;
const natsUrl = process.env.NATS_URL;
const natsClusterId = process.env.NATS_CLUSTER_URL;

const start = async () => {
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
  try {
    await natsWrapper.connect(natsClusterId, natsClientId, natsUrl);

    console.log(`Connected to NATS`);

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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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
  } catch (err) {
    console.error(err);
  }
};

start();
