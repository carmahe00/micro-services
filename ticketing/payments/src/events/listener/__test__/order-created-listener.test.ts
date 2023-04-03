import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from "@iastickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toString(),
        version: 0,
        expiresAt: new Date().toDateString(),
        userId: new mongoose.Types.ObjectId().toString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toString(),
            price: 10
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})