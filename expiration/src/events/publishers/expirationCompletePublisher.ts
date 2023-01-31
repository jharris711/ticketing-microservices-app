import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jheezytix/common';

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

export default ExpirationCompletePublisher;
