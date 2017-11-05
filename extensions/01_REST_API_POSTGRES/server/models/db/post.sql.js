import pool from './index.js'

export default {

  selectPosts: () => pool.query('SELECT * FROM public.post'),

  selectPostById: (id) => pool.query('SELECT * FROM public.post WHERE id = $1', [id]),

  insertPost: (title, text) =>
    pool.query( 'INSERT INTO public.post("title", "text") VALUES ($1, $2) RETURNING id',
      [title, text]),

  deletePost: (id) => pool.query('DELETE FROM public.post WHERE id = $1', [id]),

  updatePost: (id, title, text) =>
    pool.query('UPDATE public.post SET title = $2, text = $3 WHERE id = $1',
    [id, title, text]),

  truncatePost: () => pool.query('TRUNCATE public.post')
}
