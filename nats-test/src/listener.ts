import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events';

console.clear();

const clusterID = `ticketing`;
const clientID = randomBytes(4).toString(`hex`);

/**
 * NATS CLIENT
 */
const stan = nats.connect(clusterID, clientID, {
  url: `http://localhost:4222`,
});

/**
 * Connect to NATS
 */
stan.on(`connect`, () => {
  console.log(`Listener connected to NATS`);

  stan.on(`close`, () => {
    console.log(`NATS conection closed`);
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

/**
 * Handle signal interuption/termination
 */
process.on(`SIGINT`, () => {
  stan.close();
});
process.on(`SIGTERM`, () => {
  stan.close();
});
