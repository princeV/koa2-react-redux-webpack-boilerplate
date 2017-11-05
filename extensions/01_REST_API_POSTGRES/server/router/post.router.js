import Router from 'koa-router'
import Post from '../models/post.js'

const router = new Router()

router.get('/api/post/', async ctx => {
  const result = await Post.getAll()
  ctx.body = {data: result}
})

router.get('/api/post/:id', async ctx => {
  const { id } = ctx.params
  const result = await Post.getById(id)
  ctx.body = {data: result}
})

router.post('/api/post/', async ctx => {
  const {title, text} = ctx.request.body.data
  const post = new Post(title, text)
  const result = await post.save()
  ctx.body = {data: result}
})

router.delete('/api/post/:id', async ctx => {
  const { id } = ctx.params
  const result = await Post.deleteById(id)
  ctx.body = {data: result}
})

router.put('/api/post/:id', async ctx => {
  const { id } = ctx.params
  const {title, text} = ctx.request.body.data
  const post = new Post(title, text)
  const result = await post.updateById(id)
  ctx.body = {data: result}
})

export default router
