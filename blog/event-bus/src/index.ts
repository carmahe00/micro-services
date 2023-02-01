import express from 'express';
import axiosPost from './api/post.request'
import axiosComments from './api/comments.request'
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios';
const app = express();
app.use(cors())
app.use(bodyParser.json())
interface postInterface {
    [key:string]:{
        title: string,
        id:string
    }
}
const posts:postInterface = {}
const events:postInterface[]= [];
app.post('/events', async(req, res)=>{
    try {
        
        const event = req.body
        events.push(event);
        axiosPost.post('/events', event);
        axiosComments.post('/events', event)
        axios.post('http://query-srv:4002/events', event)
        axios.post('http://moderation-srv:4003/events', event)
        res.status(200).send({status: 'OK'})
    } catch (error) {
        console.log(error)
    }
})

app.get("/events", (req, res) => {
    res.send(events);
  });


app.listen(4005, () =>{
    console.log("listening on 4005")
})