import { Listener, Subject, TicketUpdatedEvent } from "@iastickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;
    queueGroupName: string= queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        
        const ticket = await Ticket.findByEvent(data)
        if(!ticket)
            throw new Error("Ticket not found")

        const { price, title } = data
        ticket.set({
            price,
            title
        })
        await ticket.save()
        msg.ack()   
    }
}