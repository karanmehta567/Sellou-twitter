import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static("public"))


//routes
// import userRouter from './routes/userRoute.js'
// //routes declaration
// app.use("/users", userRouter)
//routes
import router from './routes/post.js'
import LikeRouter from './routes/like.js'
import getRouter from './routes/getPosts.js'
import imageUploadRouter from './routes/ImageUpload.js'
app.use('/posts', router)
app.use('/posts', LikeRouter)
app.use('/posts', getRouter)
app.use('/upload-url', imageUploadRouter)
export default app;