import postSql from './db/post.sql.js'

class Post {
  constructor(title, text) {
    this.title = title
    this.text = text
  }

  static async getAll() {
    return await postSql.selectPosts()
  }

  static async getById(id) {
    return await postSql.selectPostById(id)
  }

  static async deleteById(id) {
    return await postSql.deletePost(id)
  }

  async updateById(id) {
    return await postSql.updatePost(id, this.title, this.text)
  }

  static async truncate(id) {
    return await postSql.truncatePost()
  }

  async save() {
    return await postSql.insertPost(this.title, this.text)
  }
}

export default Post;
