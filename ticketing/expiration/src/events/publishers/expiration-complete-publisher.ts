import { ExpirationCompleteEvent, Publisher, Subject } from "@iastickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subject.expirationComplete = Subject.expirationComplete;
    
}