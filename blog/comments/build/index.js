"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const status_enum_1 = require("./status.enum");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const commentsByPostId = {};
app.use(body_parser_1.default.json());
app.get('/posts/:id/comments', (req, res) => {
    if (commentsByPostId[req.params.id] == undefined)
        return res.send([]);
    res.send(commentsByPostId[req.params.id]);
});
app.post('/posts/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = (0, crypto_1.randomBytes)(4).toString('hex');
        const { content } = req.body;
        const comments = commentsByPostId[req.params.id] || [];
        comments.push({ id: commentId, content, status: status_enum_1.Status.pending });
        commentsByPostId[req.params.id] = comments;
        yield axios_1.default.post('http://event-bus-srv:4005/events', {
            type: 'CommentCreated',
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status: status_enum_1.Status.pending
            }
        });
        res.status(201).send(comments);
    }
    catch (error) {
        console.error(error);
    }
}));
app.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received Event', req.body.type);
    try {
        const { type, data } = req.body;
        if (type === "CommentModerated") {
            const { postId, id, status, content } = data;
            const comments = commentsByPostId[postId];
            const comment = comments.find((comment) => {
                return comment.id === id;
            });
            comment.status = status;
            yield axios_1.default.post("http://event-bus-srv:4005/events", {
                type: "CommentUpdated",
                data: {
                    id,
                    status,
                    postId,
                    content,
                },
            });
        }
        res.send({});
    }
    catch (error) {
        console.error(error);
    }
}));
app.listen(4001, () => {
    console.log("listening on 4001");
});
//# sourceMappingURL=index.js.map