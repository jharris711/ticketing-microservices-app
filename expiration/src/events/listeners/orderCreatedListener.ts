import { Listener, OrderCreatedEvent, Subjects } from '@jheezytix/common';
import { queueGroupName } from './queueCroupName';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expirationQueue';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log(`Waiting this many ms to process the job: ${delay}`);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}

export default OrderCreatedListener;
