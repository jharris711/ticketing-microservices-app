import { Subjects, Publisher, PaymentCreatedEvent } from '@jheezytix/common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

export default PaymentCreatedPublisher;
