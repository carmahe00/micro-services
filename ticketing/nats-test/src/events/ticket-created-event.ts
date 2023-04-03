import { Subject } from "./subjects.enum";

export interface TicketCreatedEvent {
    subject: Subject.TicketCreated
    data: {
        id: string,
        title: string,
        price: number;
    }
}