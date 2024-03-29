import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
process.env.JWT_KEY = 'super-secret-key';

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Fake a sign in (auth service only)
global.signin = async () => {
  const email = `test@test.com`;
  const password = `password`;

  const response = await request(app)
    .post(`/api/users/signup`)
    .send({ email, password })
    .expect(201);

  const cookie = response.get(`Set-Cookie`);

  return cookie;
};
