import express from 'express';
import { randomBytes } from 'crypto';
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from 'axios';
import { Status } from './status.enum'
const app = express();
app.use(cors())
const commentsByPostId: any = {}
app.use(bodyParser.json())


app.get('/posts/:id/comments', (req, res) => {
    if (commentsByPostId[req.params.id] == undefined)
        return res.send([])
    res.send(commentsByPostId[req.params.id])
})

app.post('/posts/:id/comments', async (req, res) => {
    try {
        const commentId = randomBytes(4).toString('hex');
        const { content } = req.body
        const comments = commentsByPostId[req.params.id] || []
        comments.push({ id: commentId, content, status: Status.pending })
        commentsByPostId[req.params.id] = comments
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentCreated',
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status: Status.pending
            }
        })
        res.status(201).send(comments)
    } catch (error) {
        console.error(error)
    }
})

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type)
    try {
        const { type, data } = req.body
        if (type === "CommentModerated") {
            const { postId, id, status, content } = data;
            const comments = commentsByPostId[postId];
        
            const comment = comments.find((comment:any) => {
              return comment.id === id;
            });
            comment.status = status;
        
            await axios.post("http://event-bus-srv:4005/events", {
              type: "CommentUpdated",
              data: {
                id,
                status,
                postId,
                content,
              },
            });
          }
        res.send({})
    } catch (error) {
        console.error(error)
    }
})

app.listen(4001, () => {
    console.log("listening on 4001")
})