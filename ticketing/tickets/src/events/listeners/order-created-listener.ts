import { Listener, OrderCancelledEvent, OrderCreatedEvent, Subject } from "@iastickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCancelledEvent>{
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket)
            throw new Error('Ticket not found')
        ticket.set({
            orderId: data.id
        })

        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id:ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })
        
        msg.ack()
    }
}