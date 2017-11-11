import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../index.js'
import Post from '../models/post.js'

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

  it("should create one post", done => {
    chai
      .request(server)
      .post(`${PATH}`)
      .send({
        "data": {
          "title": "Create API test",
          "text": "Create API test text"
        }
      })
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.eql(200)
        res.type.should.eql("application/json")
        res.body.data.command.should.eql("INSERT")
        res.body.data.rowCount.should.eql(1)
        done()
      })
  })
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

  it("should return one post", done => {
    chai
      .request(server)
      .get(`${PATH}${postId}`)
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.eql(200)
        res.type.should.eql("application/json")
        res.body.data.rows[0].should.include.keys("id", "title", "text")
        res.body.data.command.should.eql("SELECT")
        res.body.data.rowCount.should.eql(1)
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
  it("should delete one post", done => {
    chai
      .request(server)
      .delete(`${PATH}${postId}`)
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.eql(200)
        res.type.should.eql("application/json")
        res.body.data.command.should.eql("DELETE")
        res.body.data.rowCount.should.eql(1)
        done()
      })
  })


})
