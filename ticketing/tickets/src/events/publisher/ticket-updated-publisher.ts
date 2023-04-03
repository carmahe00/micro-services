import {Publisher, Subject, TicketUpdatedEvent} from '@iastickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subject.TicketUpdated;
}
