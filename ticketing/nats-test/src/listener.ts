import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear()
const sc = nats.connect('ticketing', randomBytes(4).toString('hex'))

sc.on('connect', () => {
    sc.on('close', () => {
        console.log('Nats connecting closed!')
        process.exit()
    })
    new TicketCreatedListener(sc).listen()
})

// Trigger when press ctrl + c or rs
process.on('SIGINT', () => sc.close())
process.on('SIGTERM', () => sc.close())

