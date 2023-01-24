import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models';
import natsWrapper from '../../natsWrapper'; // Remember this is the mock function we set up in tets/setup.ts

it(`has a route handler listening to /api/tickets for post requests`, async () => {
  const response = await request(app).post(`/api/tickets`).send({});

  expect(response.status).not.toEqual(404);
});

it(`can only be access if the user is signed in`, async () => {
  const response = await request(app).post(`/api/tickets`).send({});

  expect(response.status).toEqual(401);
});

it(`returns a status other than 401 if the user is signed in`, async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it(`retuns an error if an invalid title is provided`, async () => {
  // Invalid title
  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({ title: ``, price: 10 })
    .expect(400);

  // No title
  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({ price: 10 })
    .expect(400);
});

it(`returns an error if an invalid price is provided`, async () => {
  // Invalid price
  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({ title: `Ticket Title`, price: -10 })
    .expect(400);
  // No Price
  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({ title: `Ticket Title` })
    .expect(400);
});

it(`creates a ticket with valid inputs`, async () => {
  // Add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = `Ticket Title`;

  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it(`publishes an event`, async () => {
  const title = `Ticket Title`;

  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
