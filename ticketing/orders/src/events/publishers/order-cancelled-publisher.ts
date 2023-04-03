import { OrderCancelledEvent, Publisher, Subject } from "@iastickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
}