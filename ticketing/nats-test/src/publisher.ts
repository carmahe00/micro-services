import nats from 'node-nats-streaming';
console.clear()
const sc = nats.connect('ticketing', 'abs')

sc.on('connect', () => {
    const data = JSON.stringify({
        id: '132',
        title: 'concert',
        price: 20
    })
    sc.publish('ticket:created', data, () =>{
        console.log('Event published')
    })
})