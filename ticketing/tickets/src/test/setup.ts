import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
declare global {
    var signin: () => string[];
}
let mongoServer: MongoMemoryServer | null = null;
beforeAll(async () => {
    process.env.JWT_KEY = "asdf"
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "auth" });
})

beforeEach(async () => {
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

global.signin = () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    // Build a JWT payload. { id, email }
    const payload = {
        id,
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}
