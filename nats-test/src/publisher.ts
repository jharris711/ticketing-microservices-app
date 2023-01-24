import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events';

console.clear();

const stan = nats.connect(`ticketing`, `abc`, {
  url: `http://localhost:4222`,
});

stan.on(`connect`, async () => {
  console.log(`Publisher connected to NATS`);

  stan.on(`close`, () => {
    console.log(`NATS conection closed`);
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: `123`,
    title: `Concert`,
    price: `20`,
  });
});

process.on(`SIGINT`, () => {
  stan.close();
});
process.on(`SIGTERM`, () => {
  stan.close();
});
