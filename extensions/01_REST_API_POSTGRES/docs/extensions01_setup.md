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
GRANT ALL ON SEQUENCE post_id_seq TO "dbUser";
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
│   babel.hook.mocha.js
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
    │   │   post.router.js
    │
    └───test
        │   test.api.post.js

```

#### Installation
Install the pg (postgress package) and the koa bodyparser (to work with post - form and json data) with the follwoing command:
```bash
$ npm install pg@7.3.0 koa-bodyparser@4.2.0
```

#### project setup

__model & db:__  
Add the model and the db folder to the server directory.  
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
- select a single post (not included in docu)
- insert a new post (not included in docu)
- delete an exsisting post (not included in docu)
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


#### Test
In order to do an automated test on our API, we use __mocha__ and __chai__ + chai-http.

Install them via:  
```bash
$ npm install mocha@4.0.1 chai@4.1.2 chai-http@3.0.0 --save-dev
```

In the __test__ folder we add the following file:

__test.api-post.js:__  
This file will use chai as the assertion library for node and chai-http to make the api calls (get, post, put).

Here is an excerpt for the get all and the update.
Before the actual api call is done we:  
1) make sure to use chaiHttp  
2) truncate the post table and create one sample post

```javascript
const should = chai.should()
const PATH = "/api/post/"
chai.use(chaiHttp)

describe('Post API', () => {
  let postId;
  before( async function(){
    await Post.truncate()
    const post = new Post('TestTitle', 'Test Text')
    const result = await post.save()
    postId = result.rows[0].id
  })
```
Then we continue with the actual calls - we need the server from the index.js and we need to set our criteria.
Here is the code for the get all and update one part:

```javascript
  it("should return all posts", done => {
    chai
      .request(server)
      .get(`${PATH}`)
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.eql(200)
        res.type.should.eql("application/json")
        res.body.data.rows[0].should.include.keys("id", "title", "text")
        res.body.data.command.should.eql("SELECT")
        done()
      })
  })
  it("should update one post", done => {
    chai
      .request(server)
      .put(`${PATH}${postId}`)
      .send({
        "data": {
          "title": "Updated",
          "text": "Updated"
        }
      })
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.eql(200)
        res.type.should.eql("application/json")
        res.body.data.command.should.eql("UPDATE")
        res.body.data.rowCount.should.eql(1)
        done()
      })
  })
  ...
})
```

__index.js:__  
To be able to import the server in the test file we need to export it.  
To do that, make the following changes to the index.js in the server folder:
```javascript
const server = app.listen(3000)

// export the server for test usage
export default server
```

__bebel.hook.mocha.js:__
As we want to be able to use the latest js in the test files as well we need to have a babel hook for them as well.
Create the hook in the __root__ project folder and add this:
```javascript
'use strict';
require('babel-register');
require('babel-polyfill');
```

__package.json:__  
The last change is the setup of the mocha call in the package.json.  
Add this to the scripts section:

```json
"test": "mocha server/test/ --require babel.hook.mocha.js",
```

__Run Tests:__  
You should now be able to run the API test by typing:  

```bash
$ npm run test
```

with the positive results:
```bash
Post API
  √ should create one post
  √ should return all posts
  √ should return one post
  √ should update one post
  √ should delete one post


5 passing (267ms)
```
