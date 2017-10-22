# Extension 01 Setup - REST API Postgres

## Prerequisites

### Postgres

#### Installation
Download the latest version of Postgres for your OS at:  
https://www.postgresql.org/download/

Follow the instructions to finish the installation.  
--> Make sure to remember the __pwd__.  
--> The admin user will be: __postgres__

#### Setup
- Open the management tool for Postgres (e.g. pgAdmin).
- Create a new database (name: blog)
- Create a new table in the database (schema:public):

```sql
CREATE TABLE public.post
(
    "id" integer NOT NULL DEFAULT 1,
    "title" character varying(40) COLLATE pg_catalog."default",
    "text" character varying(1024) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
ALTER TABLE public.post
    OWNER to postgres;
GRANT ALL ON TABLE public.post TO "dbUser";

```
- Insert some records into the table:

```sql
INSERT INTO public.post(
	"id", "title", "text")
	VALUES (1, 'Welcome to my blog', 'This is the first blog entry...'),
    (2, 'The second post', 'Here we go, post number two...'),
    (3, 'Nuuuuuuuuumber 3 is here', 'Hello there mr. three');
```

__create User__  
Create a user that has access to the created table - in this case we used __"dbUser"__.

## Back to the js-project

#### Installation
Install the pg (postgress package) and the koa bodyparser (to work with post - form and json data) with the follwoing command:
```bash
$ npm install pg@7.3.0 koa-bodyparser@4.2.0
```

#### project setup
__new folder db:__  
Create a new folder in the root directory and name it __db__.

Create the following files in the new folder:  

__postgres.js__:  
The file will establish the connection to the postgres database based on a pool and the provided parameter.  
Make sure that all the paramter fit what was setup in postgres!
```javascript
import {Pool} from 'pg'

const pool = new Pool({
  user: 'dbUser',
  host: 'localhost',
  database: 'blog',
  password: 'dbPassword',
  port: 5432,
})

export default pool
```
__post.js__:  
In this file we will add the select statements for our api.
As this is only for demo purposes we will not do any authentication and we will create all main
routes:
- select the list
- select a single post
- insert a new post
- delete an exsisting post
- update an exsisting post

We will use the connection from the postgres file and maintain all required sql statements for the post object.

```javascript
import pool from './postgres.js'

export default {
  selectPosts: () => pool.query('SELECT * FROM public.post'),
  selectPostById: (id) => pool.query('SELECT * FROM public.post WHERE id = $1', [id]),
  insertPost: ({id, title, text}) =>
    pool.query( 'INSERT INTO public.post("id", "title", "text") VALUES ($1, $2, $3)',
      [id, title, text]),
  deletePost: (id) => pool.query('DELETE FROM public.post WHERE id = $1', [id]),
  updatePost: ({id, title, text}) =>
    pool.query('UPDATE public.post SET title = $2, text = $3 WHERE id = $1',
    [id, title, text]),
}
```
__new folder router:__  
Create another folder in the root directory and name it __router__.
This folder will have all files that we want to route via our api for access from the outside.

__post.methods.js__  
This file contains all the methods that we want to publish for the post object.
In this case we create one for each query that we defined in the post file:
```javascript
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
```

__post.router.js__  
In this file we are going to use the methods ffom the previous file and link them to the different api routes:

```javascript
import Router from 'koa-router'
import {getPostList, getPostById, createPost, deletePost, updatePost} from './post.methods.js'

const router = new Router()

router.get('/api/post/', getPostList)
router.get('/api/post/:id', getPostById)
router.post('/api/post/', createPost)
router.delete('/api/post/:id', deletePost)
router.post('/api/post/:id', updatePost)

export default router
```

__Back to the root folder__  
Lets finalize the steps and make the new routes accessable via the given urls.

__Change in server.js:__  
First we need to add some imports to be able to parse the post/json data and to access the created router:

```javascript
import appRouter from './router/post.router.js'
import bodyParser from 'koa-bodyparser'
```

After that we need to add the bodyparser to the application by the following:
```javascript
// bodyParser to parse e.g. Post from Form/Json
app.use(bodyParser())
```

The last step is to add the router to the application:
```javascript
// add all the server side routes
app.use(appRouter.routes());
```

After that you will be able to access the api with the following URLs:
GET - http://localhost:3000/api/post/ to see the list of posts
GET - http://localhost:3000/api/post/:id to see one exsisting post depending on the :id
POST - http://localhost:3000/api/post/ to create a new post (can be tested with e.g. Postman)
DELETE - http://localhost:3000/api/post/:id to delete one exsisting post depending on the :id
POST - http://localhost:3000/api/post/:id to update one exsisting post depending on the :id (title and text)
