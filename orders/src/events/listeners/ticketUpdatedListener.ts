import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@jheezytix/common';
import { Ticket } from '../../models';
import { queueGroupName } from './queueGroupName';

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error(`Ticket not found`);

    const { title, price, version } = data;

    ticket.set({ title, price, version });

    await ticket.save();

    msg.ack();
  }
}

export default TicketUpdatedListener;
