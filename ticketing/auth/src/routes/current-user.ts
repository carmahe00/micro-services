import express, { Request, Response } from 'express';
import { currentUser } from '@iastickets/common';
import { requireAuth } from '@iastickets/common';
const router = express.Router();

router.get('/api/users/currentuser', [ currentUser, requireAuth],(req:Request, res:Response) => {
    res.send(req.currentUser || null)
})

export { router as currentUserRouter }