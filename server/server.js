import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRouter.js'
import messageRouter from './routes/messageRouter.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebjooks } from './controllers/webhooks.js'

const app =express()

await connectDB()
// stripe webhooks 
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebjooks)
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>res.send('server is live'))

app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})