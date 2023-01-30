import request from 'supertest';
import app from '../../app';
import { Ticket, Order } from '../../models';
import { OrderStatus } from '../../models/order';
import natsWrapper from '../../natsWrapper';
import mongoose from 'mongoose';

it(`marks an order as canceled`, async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();

  // Make a req to create an order
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, user)
    .send({ ticketId: ticket.id })
    .expect(201);

  try {
    // Make a req to cancel the order
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set(`Cookie`, user)
      .send()
      .expect(204);
  } catch (err) {
    console.log(err);
  }

  // Expectation to make sure the thing is canceled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

// Publish an OrderCanceled event
it(`emits an OrderCanceled event`, async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();

  // Make a req to create an order
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set(`Cookie`, user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a req to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set(`Cookie`, user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
