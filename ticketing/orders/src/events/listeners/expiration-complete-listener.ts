import { ExpirationCompleteEvent, Listener, OrderStatus, Subject } from "@iastickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    queueGroupName: string = queueGroupName;
    subject: Subject.expirationComplete = Subject.expirationComplete;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')
        if (!order)
            throw new Error('Order not found')
        if (order.status === OrderStatus.Complete)
            throw msg.ack()
        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save()
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        msg.ack()
    }
}