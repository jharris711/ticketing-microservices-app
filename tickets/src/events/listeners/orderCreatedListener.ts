import { Listener, OrderCreatedEvent, Subjects } from '@jheezytix/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // Find the ticket the the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error(`Ticket not found`);
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // Import the nats client property from the
    // base listener in the common module
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Ack the message
    msg.ack();
  }
}

export default OrderCreatedListener;
