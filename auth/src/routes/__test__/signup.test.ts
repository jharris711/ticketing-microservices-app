import request from 'supertest';
import app from '../../app';

/**
 * Success
 */
it(`returns a 201 on successful signup`, async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'testarooni@email.com',
      password: 'password',
    })
    .expect(201);
});

/**
 * Fail Email
 */
it(`returns a 400 with an invalid email`, async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({ email: 'This shouldnt work', password: 'password' })
    .expect(400);
});

/**
 * Fail password
 */
it(`returns a 400 with an invalid password`, async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({ email: 'test@test.com', password: 'no' })
    .expect(400);
});

/**
 * Fail email & passoword
 */
it(`returns a 400 with missing email and password`, async () => {
  return request(app).post(`/api/users/signup`).send({}).expect(400);
});

/**
 * Require unique email
 */
it(`disallows duplicate emails`, async () => {
  // Expect 201 from first req
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'testarooni@email.com',
      password: 'password',
    })
    .expect(201);
  // Expect 400 from second req
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'testarooni@email.com',
      password: 'password',
    })
    .expect(400);
});

it(`sets a cookie after successful signup`, async () => {
  const response = await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'testarooni@email.com',
      password: 'password',
    })
    .expect(201);
  expect(response.get(`Set-Cookie`)).toBeDefined();
});
