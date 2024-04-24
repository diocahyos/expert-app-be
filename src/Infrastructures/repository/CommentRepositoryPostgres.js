const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment (comment, userId, threadId) {
    const { content } = comment
    const date = new Date()
    const id = `comment-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5,$6) RETURNING id, content, user_id AS owner',
      values: [id, content, date, userId, threadId, false]
    }

    const result = await this._pool.query(query)
    return new AddedComment({ ...result.rows[0] })
  }

  async checkCommentIsExist (id, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan di database')
    }
  }

  async verifyOwnerComment (commentId, userId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND user_id = $2',
      values: [commentId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError('maaf kamu tidak berhak untuk menghapus comment ini')
    }
  }

  async deleteComment (commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted=true WHERE id= $1',
      values: [commentId]
    }

    await this._pool.query(query)
  }
}

module.exports = CommentRepositoryPostgres
