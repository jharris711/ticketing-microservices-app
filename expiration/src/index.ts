import natsWrapper from './natsWrapper';

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const natsClientId = process.env.NATS_CLIENT_ID;
const natsUrl = process.env.NATS_URL;
const natsClusterId = process.env.NATS_CLUSTER_URL;

const start = async () => {
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
};

start();
