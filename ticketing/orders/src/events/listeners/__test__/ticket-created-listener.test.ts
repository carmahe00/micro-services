import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import { TicketCreatedEvent } from '@iastickets/common'
import mongoose from 'mongoose'
import { Ticket } from "../../../models/ticket"

const setup = () =>{
    const listener = new TicketCreatedListener(natsWrapper.client)
    
    const data : TicketCreatedEvent['data'] ={
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}

it('creates and save a ticket',async () => {
    const { data, listener, msg } = await setup()
    await listener.onMessage(data, msg)
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('acks the message',async () => {
    const { data, listener, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})
