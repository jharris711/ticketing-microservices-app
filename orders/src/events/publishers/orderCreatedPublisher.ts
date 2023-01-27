import { Publisher, OrderCreatedEvent, Subjects } from '@jheezytix/common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

export default OrderCreatedPublisher;
