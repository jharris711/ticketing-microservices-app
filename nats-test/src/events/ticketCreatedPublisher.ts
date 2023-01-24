import Publisher from './basePublisher';
import TicketCreatedEvent from './ticketCreatedEvent';
import Subjects from './subjects';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
export default TicketCreatedPublisher;
