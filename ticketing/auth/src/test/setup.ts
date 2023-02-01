import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app';
declare global {
    var signin: () => Promise<string[]>;
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

global.signin  = async() =>{
    const response = await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@email.es",
        password: "1234560"
    })
    const cookie = response.get("Set-Cookie")
    return cookie
}
