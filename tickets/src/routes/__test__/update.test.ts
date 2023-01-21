import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';

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

it(`return a 400 if the user provides an invalid title or price`, async () => {});

it(`updates the ticket provided valid inputs`, async () => {});
