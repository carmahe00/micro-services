import { OrderCreatedEvent, Publisher, Subject } from "@iastickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated;
}