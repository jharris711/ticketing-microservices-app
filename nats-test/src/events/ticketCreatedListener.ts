import { Message } from 'node-nats-streaming';
import Listener from './baseListener';
import TicketCreatedEvent from './ticketCreatedEvent';
import Subjects from './subjects';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = `payments-service`;

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log(`Event Data: ${JSON.stringify(data)}`);

    msg.ack();
  }
}

export default TicketCreatedListener;
