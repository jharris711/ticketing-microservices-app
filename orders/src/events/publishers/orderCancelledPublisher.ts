import { Publisher, Subjects, OrderCancelledEvent } from '@jheezytix/common';

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

export default OrderCancelledPublisher;
