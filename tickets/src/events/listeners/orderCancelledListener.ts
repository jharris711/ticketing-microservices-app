import { Listener, OrderCancelledEvent, Subjects } from '@jheezytix/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error(`Ticket not found`);

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}

export default OrderCancelledListener;
