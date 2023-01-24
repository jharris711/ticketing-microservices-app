import { Publisher, Subjects, TicketCreatedEvent } from '@jheezytix/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export default TicketCreatedPublisher;
