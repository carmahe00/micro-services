import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios';
import { Status } from './status.enum';
const app = express();
app.use(cors())
app.use(bodyParser.json())


app.post('/events', async (req, res) => {
    const { type, data } = req.body;
  
    if (type === 'CommentCreated') {
      const status = data.content.toString().includes('orange') ? Status.rejected : Status.approved  ;
  
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content
        }
      });
    }
  
    res.send({});
  });

app.listen(4003, () =>{
    console.log("listening on 4003")
})