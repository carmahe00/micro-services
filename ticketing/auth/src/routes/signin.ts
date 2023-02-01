import express, { Request, Response } from 'express';
import { body } from 'express-validator'

import jsonwebtoken from 'jsonwebtoken'

import { User } from '../models';
import { BadRequestError } from '@iastickets/common';
import { Password } from '../services';
import { validationRequest } from '@iastickets/common';
const router = express.Router();

router.post('/api/users/signin',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').trim().notEmpty().withMessage("You must supply password"),
    validationRequest
] , async(req:Request, res:Response) =>{
    const {email, password} = req.body
    const existingUser = await User.findOne({email})
    if(!existingUser)
        throw new BadRequestError("Invalid Credentials no exist")
    const passwordMatch = await Password.compare(existingUser.password, password)
    if(!passwordMatch)
        throw new BadRequestError("Invalid Credentials no password")

    // Generate Token
    const jwt = jsonwebtoken.sign({
        id:existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!)

    //Store it on session object and send cookies to the user in base64
    req.session = {
        jwt
    }
    res.send(existingUser).status(201)
})

export {router as signInRoute}