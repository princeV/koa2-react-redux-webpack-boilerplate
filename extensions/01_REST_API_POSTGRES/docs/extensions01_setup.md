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
- Create a user
- Create a new table with a sequence for the id in the database (schema:public):

__create user__  
Create a user in the user administration e.g. pgAdmin - in this case we used __"dbUser"__.


__create table:__  
```sql
CREATE SEQUENCE post_id_seq;
CREATE TABLE public.post
(
    "id" integer PRIMARY KEY default nextval('post_id_seq'),
    "title" character varying(40),
    "text" character varying(1024)
);
alter sequence post_id_seq owned by public.post.id;
GRANT ALL ON TABLE public.post TO "dbUser";
GRANT ALL ON TABLE public.post TO "postgres";
```
Insert some records to have some sample data:

```sql
INSERT INTO public.post("title", "text")
	VALUES ('Welcome to my blog', 'This is the first blog entry...'),
    ('The second post', 'Here we go, post number two...'),
    ('Nuuuuuuuuumber 3 is here', 'Hello there mr. three');
```

## Back to the js-project

## Folder structure:
```bash
project  
│   .babelrc
│   babel.hook.js
│   package.json
│   webpack.config.js  
│
└───app
│   │   application data (react redux)
│
└───extensions
│   │   different extensions e.g. api setup etc.
│     
└───server
    │   index.html.js
    │   index.js  
    │
    └───models
    │   │   post.js
    │   │
    │   └───db
    │       │   index.js
    │       │   post.sql.js
    │        
    └───router
        │   post.router.js

```

#### Installation
Install the pg (postgress package) and the koa bodyparser (to work with post - form and json data) with the follwoing command:
```bash
$ npm install pg@7.3.0 koa-bodyparser@4.2.0
```

#### project setup

__model & db:__  
Add the model and the db folter to the server directory.  
In the __db__ folder we need two files:

__index.js:__  
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

__post.sql.js__:  
In this file we will add the select statements for our api.
As this is only for demo purposes we will not do any authentication and we will create all main
routes:
- select the list
- select a single post
- insert a new post
- delete an exsisting post
- update an exsisting post

We will use the connection from the db connection setup file and maintain all required sql statements for the post object.

Let's have a look at the examples for getting all post and updating the posts in the upcoming sections.  
The rest can be reviewed in the repository.


```javascript
export default {
  selectPosts: () => pool.query('SELECT * FROM public.post'),
  updatePost: (id, title, text) =>
    pool.query('UPDATE public.post SET title = $2, text = $3 WHERE id = $1',
    [id, title, text])
  ...
}
```
In the __model__ folder create the following file:  

__post.js:__  
This file is the actual model that is implemented as a class with a constructor that includes the attributes.
* It contains a link to all queries for the database. They were not implemented in this file to seperate the database from the model - this makes it easier to switch the db.
* We also make sure to provide all methods that are not related to an instance as static to the public. (to be able to call them without creating a new Object())

```javascript
import postSql from './db/post.sql.js'

class Post {
  constructor(title, text) {
    this.title = title
    this.text = text
  }
  static async getAll() {
    return await postSql.selectPosts()
  }
  async updateById(id) {
    return await postSql.updatePost(id, this.title, this.text)
  }
  ...
}

export default Post;
```

__router:__  
Create another folder in the server directory and name it __router__.
This folder will have all files that we want to route via our api for access from the outside.

__post.router.js__  
In this file we are going to use the methods and link them to the different api routes. The main purposes are:  
* Setup the routes
* Pass all parameter, from url (ctx.params) or from the post/put call (ctx.request.body)

```javascript
const router = new Router()

router.get('/api/post/', async ctx => {
  const result = await Post.getAll()
  ctx.body = {data: result}
})
router.put('/api/post/:id', async ctx => {
  const { id } = ctx.params
  const {title, text} = ctx.request.body.data
  const post = new Post(title, text)
  const result = await post.updateById(id)
  ctx.body = {data: result}
})
...
export default router
```

__Back to the server folder__  
Lets finalize the steps and make the new routes accessable via the given urls.

__Change in index.js:__  
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
- GET - http://localhost:3000/api/post/ to see the list of posts
- GET - http://localhost:3000/api/post/:id to see one exsisting post depending on the :id
- POST - http://localhost:3000/api/post/ to create a new post (can be tested with e.g. Postman)
- DELETE - http://localhost:3000/api/post/:id to delete one exsisting post depending on the :id
- POST - http://localhost:3000/api/post/:id to update one exsisting post depending on the :id (title and text)
