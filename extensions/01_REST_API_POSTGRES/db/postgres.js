import {Pool} from 'pg'

const pool = new Pool({
  user: 'dbUser',
  host: 'localhost',
  database: 'blog',
  password: 'dbPassword',
  port: 5432,
})

export default pool
