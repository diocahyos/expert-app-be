const CommentRepository = require('../../Domains/comments/CommentRepository')

class UserCommentLikeRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addCommentLike (commentId, userId) {
    const id = `uc_like-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId]
    }

    await this._pool.query(query)
  }

  async deleteCommentLike (commentId, userId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId]
    }

    await this._pool.query(query)
  }

  async getCommentLikeByCommentId (commentId) {
    const query = {
      text: 'SELECT COUNT(id) AS likecount FROM user_comment_likes WHERE comment_id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)
    const likeCount = Number(result.rows[0].likecount)
    return likeCount
  }

  async checkCommentLike (commentId, userId) {
    const query = {
      text: `
        SELECT id FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2
      `,
      values: [userId, commentId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      return false
    }
    return true
  }
}

module.exports = UserCommentLikeRepositoryPostgres
