import {Publisher, Subject, TicketCreatedEvent} from '@iastickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subject.TicketCreated;
}
