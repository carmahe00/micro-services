import express, { Request, Response } from 'express';
import {body} from 'express-validator'
import jsonwebtoken from 'jsonwebtoken'


import { User } from '../models';
import { BadRequestError } from '@iastickets/common';
import { validationRequest } from '@iastickets/common';
const router = express.Router();

router.post('/api/users/signup',
   [
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').trim().isLength({min: 4, max: 20}),
    validationRequest
   ],
    async(req:Request, res: Response) =>{
    const {email, password} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new BadRequestError('Email in use')
    }
    const user = User.build({email, password})
    await user.save()

    
    // Generate Token
    const jwt = jsonwebtoken.sign({
        id:user.id,
        email: user.email
    }, process.env.JWT_KEY!)

    //Store it on session object and send cookies to the user in base64
    req.session = {
        jwt
    }
    res.status(201).send(user)
})

export {router as signUpRoute}