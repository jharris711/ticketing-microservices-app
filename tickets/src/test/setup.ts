import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'super-secret-key';
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

// Fake sign in (tickets service only)
global.signin = () => {
  // Create an id from the mongo type
  const id = new mongoose.Types.ObjectId().toHexString();
  // Build JSON web token payload { id, email }
  const payload = { id, email: `test@test.com` };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object ( jwt: MY_JWT )
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a str that is the
  // cookie with the encoded data
  return [`session=${base64}`];
};
