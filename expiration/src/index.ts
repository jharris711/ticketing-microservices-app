import natsWrapper from './natsWrapper';
import OrderCreatedListener from './events/listeners/orderCreatedListener';

const natsClientId = process.env.NATS_CLIENT_ID;
const natsUrl = process.env.NATS_URL;
const natsClusterId = process.env.NATS_CLUSTER_ID;
const redisHost = process.env.REDIS_HOST;

const start = async () => {
  if (!natsClientId) {
    throw new Error(`NATS_CLIENT_ID must be defined`);
  }
  if (!natsUrl) {
    throw new Error(`NATS_URL must be defined`);
  }
  if (!natsClusterId) {
    throw new Error(`NATS_CLUSTER_ID must be defined`);
  }
  if (!redisHost) {
    throw new Error(`REDIS_HOST must be defined`);
  }

  /**
   * NATS
   */
  try {
    await natsWrapper
      .connect(natsClusterId, natsClientId, natsUrl)
      .catch((e) => console.error(e));

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
  } catch (err) {
    console.error(err);
  }
};

start();
