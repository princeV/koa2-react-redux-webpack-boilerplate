import Router from 'koa-router'
import {getPostList, getPostById, createPost, deletePost, updatePost} from './post.methods.js'

const router = new Router()

router.get('/api/post/', getPostList)
router.get('/api/post/:id', getPostById)
router.post('/api/post/', createPost)
router.delete('/api/post/:id', deletePost)
router.post('/api/post/:id', updatePost)

export default router
