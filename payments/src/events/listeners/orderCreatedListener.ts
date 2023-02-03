import { Listener, OrderCreatedEvent, Subjects } from '@jheezytix/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}

export default OrderCreatedListener;
