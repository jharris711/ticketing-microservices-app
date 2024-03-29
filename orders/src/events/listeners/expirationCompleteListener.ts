import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  NotFoundError,
} from '@jheezytix/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models';
import { OrderStatus } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers';

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName: string = queueGroupName;
  readonly subject = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

export default ExpirationCompleteListener;
