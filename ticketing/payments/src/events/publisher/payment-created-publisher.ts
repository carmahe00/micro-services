import { PaymentCreatedEvent, Publisher, Subject } from "@iastickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
    
}