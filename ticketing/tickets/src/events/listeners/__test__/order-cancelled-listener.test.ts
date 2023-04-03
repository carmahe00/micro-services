import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/tickets';
import { OrderCancelledEvent, OrderStatus } from '@iastickets/common';
import { OrderCancelledListener } from '../OrderCancelledListener';


const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString()
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf'
  });
  ticket.set({
    orderId
  })
  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { orderId, listener, ticket, data, msg };
};



it('update the ticket, publish an event and ack message',async ( ) => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket?.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
