import express from 'express'
import {Request, Response} from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {testingRouter} from "./routes/testing-router";
import {securityDevicesRouter} from "./routes/security-devices-router";

import {runDb} from "./repositories/db";

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.set('trust proxy', true)
const parserMiddleware = express.json()
app.use(parserMiddleware)
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send(':0')
})
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)
app.use('/security/devices', securityDevicesRouter)



const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()