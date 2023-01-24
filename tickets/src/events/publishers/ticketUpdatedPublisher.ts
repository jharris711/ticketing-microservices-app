import { Publisher, Subjects, TicketUpdatedEvent } from '@jheezytix/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

export default TicketUpdatedPublisher;
