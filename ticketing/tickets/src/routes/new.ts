import { requireAuth, validationRequest } from '@iastickets/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models/tickets'
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()
router.post('/api/tickets',
    requireAuth,
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required'),
        body('price')
            .notEmpty()
            .isInt({ gt: 0, min: 0 })
            .withMessage('Price must be grater than 0')

    ],
    validationRequest
    ,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,
        });
        await ticket.save();
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: req.currentUser!.id
        })
        res.status(201).send(ticket);
    })

export { router as createTicketRouter }
