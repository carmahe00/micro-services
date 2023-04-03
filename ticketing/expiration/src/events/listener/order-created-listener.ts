import { Listener, OrderCreatedEvent, Subject } from "@iastickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming'
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject:Subject.OrderCreated= Subject.OrderCreated;
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getDate()
        console.log("Waiting this many milliseconds to process the job", delay)
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        })

        msg.ack()
    }
}