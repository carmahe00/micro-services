import { TicketUpdatedEvent } from "@iastickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const fakeUserId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version+1,
        title: 'new concert',
        price: 999,
        userId: fakeUserId,
    }
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn(),
    }

    return {msg, data, ticket, listener}
}

it('finds, updates and serves a ticket', async () => {
    const {msg, data, listener, ticket}= await setup()
    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket?.title).toEqual(data.title)
    expect(updatedTicket?.price).toEqual(data.price)
    expect(updatedTicket?.version).toEqual(data.version)
})

it('acks the message',async () => {
    const {msg, data, listener, ticket}= await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version',async () => {
    const {msg, data, listener, ticket}= await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
        
    } catch (error) {
    }
    expect(msg.ack).not.toHaveBeenCalled()
})