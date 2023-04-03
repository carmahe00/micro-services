import mongoose from 'mongoose'
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@iastickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup =async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    })

    await order.save()

    const data:OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString()
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, order}
}

it('update the status of the order',async () => {
    const { data, listener, msg, order } = await setup();
    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message',async () => {
    const { data, listener, msg, order } = await setup();
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})