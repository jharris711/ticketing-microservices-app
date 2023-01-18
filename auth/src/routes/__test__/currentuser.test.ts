import request from 'supertest';
import app from '../../app';

const endpoint = `/api/users/currentuser`;

it(`responds with details about the current user`, async () => {
  const cookie = await global.signin();

  await request(app).get(endpoint).set(`Cookie`, cookie).send().expect(200);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get(endpoint).send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
