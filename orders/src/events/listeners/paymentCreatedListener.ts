import { Subjects, Listener, PaymentCreatedEvent } from '@jheezytix/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';
import { OrderStatus } from '../../models/order';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: PaymentCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error(`Order not found`);

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}

export default PaymentCreatedListener;
