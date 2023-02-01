import express from 'express';
import { randomBytes } from 'crypto';
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios';
const app = express();
app.use(cors())
app.use(bodyParser.json())
const posts:{
    [key:string]:{
        title: string,
        id:string
    }
} = {}
app.get('/posts', (req, res) =>{
    res.send(posts)
})

app.post('/posts/create', async(req, res)=>{
    const id = randomBytes(4).toString('hex');
    const { title } = req.body
    posts[id] = {
        id, title
    }
    await axios.post('http://event-bus-srv:4005/events',{
        type:'PostCreated',
        data: {
            id, title
        }
    })
    return res.status(201).send(posts[id])
})

app.post('/events', (req, res)=>{
    console.log('Received Event', req.body.type)
    res.send({})
})

app.listen(4000, () =>{
    console.log("Version: v.1")
    console.log("listening on 4000")
})