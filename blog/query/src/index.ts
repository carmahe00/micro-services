import express from 'express';
import bodyParser from 'body-parser'
import axios from 'axios'
import cors from 'cors'
interface Post {
    [key: string]: {
        id:string,
        title: string,
        comments: [
            {id:string, content:string, status?:string}
        ]
    }
}
const app = express();
const posts:Post = {}
app.use(cors())
app.use(bodyParser.json())

const handleEvent = (type:string, data:any) => {
    if(type== 'PostCreated'){
        const {id, title} = data
        posts[id] = {
            id, title, comments: [] as any
        }
    }
    if(type == 'CommentCreated'){
        const {id, content, postId, status} = data
        const post = posts[postId];
        post.comments.push({
            id, content,status
        })
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
    
        const post = posts[postId];
        const comment = post.comments.find(comment => {
          return comment.id === id;
        });
    
        comment!.status = status;
        comment!.content = content;
      }
}
app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body
    handleEvent(type, data)

    res.send({})
})


app.listen(4002, async() => {
    console.log("Listening on 4002");
  try {
    const res = await axios.get("http://event-bus-srv:4005/events");
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error:any) {
    console.log(error.message);
  }
})