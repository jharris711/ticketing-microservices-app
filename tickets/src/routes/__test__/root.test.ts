import request from 'supertest';
import app from '../../app';

it(`can fetch a list of tickets`, async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get(`/api/tickets`).send().expect(200);

  expect(response.body.length).toEqual(3);
});

async function createTicket() {
  const title = `concert`;
  const price = 20;
  // Create a ticket first
  const ticket = await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`, global.signin())
    .send({ title, price })
    .expect(201);
  return ticket;
}
