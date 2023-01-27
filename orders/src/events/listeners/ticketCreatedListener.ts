import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@jheezytix/common';
import { Ticket } from '../../models';
import { queueGroupName } from './queueGroupName';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    const { title, price } = data;
    const ticket = Ticket.build({
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}

export default TicketCreatedListener;
