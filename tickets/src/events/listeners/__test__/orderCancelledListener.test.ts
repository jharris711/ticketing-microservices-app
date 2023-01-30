import mongoose from 'mongoose';
import { Ticket } from '../../../models';
import natsWrapper from '../../../natsWrapper';
import OrderCancelledListener from '../orderCancelledListener';
import { OrderCancelledEvent } from '@jheezytix/common';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'asdf',
    price: 666,
    userId: 'asdfasdfasdf',
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: { id: ticket.id },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};

it(`updates the ticket, published an event and acks the message`, async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const udpatedTicket = await Ticket.findById(ticket.id);

  expect(udpatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
