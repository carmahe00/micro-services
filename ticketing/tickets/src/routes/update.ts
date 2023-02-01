import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validationRequest,
  NotFoundError,
  requireAuth,
  NotAuthorized,
} from '@iastickets/common';
import { Ticket } from '../models/tickets';


const router = express.Router();

router.put(
  '/api/tickets/:id',
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
  validationRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    const { title, price } = req.body

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id)
      throw new NotAuthorized()

    ticket.set(
      {
        title, price
      }
    )
    await ticket.save()
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
