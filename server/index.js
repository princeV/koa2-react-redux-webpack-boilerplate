'use strict'

import Koa from 'koa'
import html from './index.html.js'
import serve from 'koa-static'

const app = new Koa()

// serve static files e.g. bundle.js
app.use(serve('./build'))

// set the initial content
app.use((ctx, next) => {
  ctx.body = html('hello')
})

// start server at port 3000
app.listen(3000)
console.log('Server is listening at port: 3000')
