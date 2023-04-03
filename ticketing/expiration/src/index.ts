
import { OrderCreatedListener } from './events/listener/order-created-listener'
import { natsWrapper } from './nats-wrapper'


const start = async () => {
    
    if(!process.env.NATS_URL || !process.env.NATS_CLUSTER_ID )
        throw new Error("NATS must be defined")
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, "id-unique", process.env.NATS_URL)
        natsWrapper.client.on('close', () => {
            console.log('Nats connecting closed!')
            process.exit()
        })
        // Trigger when press ctrl + c or rs
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

  
        new OrderCreatedListener(natsWrapper.client).listen()
    } catch (error) {
        console.error(error)
    }

   
}

start()