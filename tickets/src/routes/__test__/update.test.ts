import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import natsWrapper from '../../natsWrapper';

it(`return a 404 if the provided id does not exist`, async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set(`Cookie`, global.signin())
    .send({ title: `Random title`, price: 20 })
    .expect(404);
});

it(`return a 401 if the user is not authenticated`, async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: `Random title`, price: 20 })
    .expect(401);
});

it(`return a 401 if the user does not own the ticket`, async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({
      title: `aljkdsf`,
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set(`Cookie`, global.signin())
    .send({ title: `asdfa`, price: 1000 })
    .expect(401);
});

it(`return a 400 if the user provides an invalid title or price`, async () => {
  // Use same user for both reqs
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, cookie)
    .send({
      title: `aljkdsf`,
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set(`Cookie`, cookie)
    .send({ title: ``, price: 20 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set(`Cookie`, cookie)
    .send({ title: `valid title`, price: -20 })
    .expect(400);
});

it(`updates the ticket provided valid inputs`, async () => {
  // Use same user for both reqs
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, cookie)
    .send({
      title: `aljkdsf`,
      price: 20,
    })
    .expect(201);

  // Send an update
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set(`Cookie`, cookie)
    .send({ title: `Valid Title`, price: 100 })
    .expect(200);

  // Get the updated ticket for equality checking
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(`Valid Title`);
  expect(ticketResponse.body.price).toEqual(100);
});

it(`publishes an event`, async () => {
  // Use same user for both reqs
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, cookie)
    .send({
      title: `aljkdsf`,
      price: 20,
    })
    .expect(201);

  // Send an update
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set(`Cookie`, cookie)
    .send({ title: `Valid Title`, price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
