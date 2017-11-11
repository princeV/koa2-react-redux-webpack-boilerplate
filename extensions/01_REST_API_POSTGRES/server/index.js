'use strict'

import Koa from 'koa'
import html from './index.html.js'
import serve from 'koa-static'
import appRouter from './router/post.router.js'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

// bodyParser to parse e.g. Post from Form/Json
app.use(bodyParser())

// serve static files e.g. bundle.js
app.use(serve('./build'))

// add all the server side routes
app.use(appRouter.routes());

// set the initial content
app.use((ctx, next) => {
  ctx.body = html('hello')
})

// start server at port 3000
const server = app.listen(3000)
console.log('Server is listening at port: 3000')

// export the server for test usage
export default server
