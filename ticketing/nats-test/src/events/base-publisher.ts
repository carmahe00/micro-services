import { Stan } from 'node-nats-streaming'
import { Subject } from './subjects.enum'
interface Event {
    subject: Subject;
    data: any
}
export abstract class Publisher<T extends Event>{
    abstract subject: T['subject']
    private client: Stan
    constructor(client: Stan) {
        this.client = client
    }

    publish(data: T['data']): Promise<void> {

        return new Promise((resolve, rejected) => {
            this.client.publish(this.subject, JSON.stringify(data), (err, msg) => {
                if (err)
                    return rejected(err)
                console.log(msg)
                resolve()
            })
        })
    }
}