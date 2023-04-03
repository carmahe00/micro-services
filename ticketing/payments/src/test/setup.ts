import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
declare global {
    var signin: (id?: string) => string[];
  }
jest.mock('../nats-wrapper.ts')
process.env.STRIPE_KEY= 'sk_test_51MqUy2ILSrxHzovvbpAJqyZPqFjD6LaggGNk7AfLBrNqVpuGIRrQQ5XLXC3Ejpbuziew2ef6C94zP4FkhkSH2Yfh00vdluTrS1'
let mongoServer: MongoMemoryServer | null = null;
beforeAll(async () => {
    process.env.JWT_KEY = "asdf"
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "auth" });
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    collections.map(async (collection) => {
        await collection.deleteMany({})
    })
})

afterAll(async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
};