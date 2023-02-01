import { randomBytes } from 'crypto';
import nats, {Message} from 'node-nats-streaming';

console.clear()
const sc = nats.connect('ticketing', randomBytes(4).toString('hex'))

sc.on('connect', () => {
    sc.on('close', () =>{
        console.log('Nats connecting closed!')
        process.exit()
    })
    const opts = sc.subscriptionOptions()
    opts.setManualAckMode(true)
    const subscription = sc.subscribe('ticket:created', opts)
    
    subscription.on('message', (msg:Message) => {
        const data = msg.getData()
        if(typeof data == 'string')
        console.log(`Recived event #${msg.getSequence()}, with data: ${data}`)
        msg.ack()
    })
})

// Trigger when press ctrl + c or rs
process.on('SIGINT', () => sc.close())
process.on('SIGTERM', () => sc.close())