import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear()
const sc = nats.connect('ticketing', 'abs')

sc.on('connect', async() => {
    const publisher = new TicketCreatedPublisher(sc)
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        })
    } catch (error) {
        console.error(error)
    }
})