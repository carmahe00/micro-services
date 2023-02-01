import express from 'express'
import {json} from 'body-parser'
import 'express-async-errors' //case of an async function, just throw a normal exception for middlweare

import cookieSession from 'cookie-session'

import { NotFoundError, currentUser, errorsHandler } from '@iastickets/common'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes'
import { updateTicketRouter } from './routes/update'


const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //only https
}))

app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

/**
 * All routes (GET, PUT, DELETE...) are not found
 */
app.all('*', async(req, res, next) =>{
    throw new NotFoundError()
})

app.use(errorsHandler)

export {app}