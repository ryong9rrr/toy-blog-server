import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import api from './api'
import jwtMiddleware from './lib/jwtMiddleware'
dotenv.config()

const { PORT, MONGO_URI } = process.env

mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((e) => console.error(e))

const app = new Koa()
const router = new Router()

router.use('/api', api.routes())

app.use(bodyParser())
app.use(jwtMiddleware)
app.use(router.routes()).use(router.allowedMethods())

const port = PORT || 4000

app.listen(4000, () => {
  console.log('Listening to port %d', port)
})
