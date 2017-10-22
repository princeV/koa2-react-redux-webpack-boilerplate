import post from '../db/post.js'
//GET - get list of all posts
const getPostList = async ctx => {
  await runQuery(ctx, post.selectPosts)
}
//GET  - get post by id
const getPostById = async ctx => {
  const { id } = ctx.params
  await runQuery(ctx, post.selectPostById, id)
}
// POST - create a post
const createPost = async ctx => {
  const {data} = ctx.request.body
  await runQuery(ctx, post.insertPost, data)
}
// DELETE - delete a post by id
const deletePost = async ctx => {
  const { id } = ctx.params
  await runQuery(ctx, post.deletePost, id)
}
//UPDATE - update a post (all parameter except id)
const updatePost = async ctx => {
  const { id } = ctx.params
  const {data} = ctx.request.body
  data.id = id
  await runQuery(ctx, post.updatePost, data)
}
// Helper query
async function runQuery(ctx, query, params){
  try {
    const res = await query(params)
    ctx.body = {
      data: res
    };
  } catch (error) {
    console.error(error);
  }
}
export {getPostList, getPostById, createPost, deletePost, updatePost}
