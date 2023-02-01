import request from 'supertest'
import { app } from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@email.es",
            password: "1234560"
        })
        .expect(201)
})

it('returns a 400 on failed signup email', async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test",
            password: "1234560"
        })
        .expect(400)
})

it('returns a 400 on failed signup password', async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@mail.es",
            password: "12"
        })
        .expect(400)
})

it('returns a 400 on failed signup password', async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@mail.es",
            password: "12"
        })
        .expect(400)
})

it('disallows duplicate emails', async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@email.es",
            password: "1234560"
        })
        .expect(201)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@email.es",
            password: "1234560"
        })
        .expect(400)
})

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@email.es",
            password: "1234560"
        })
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
})