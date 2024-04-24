const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const AddedReply = require('../../Domains/replies/entities/AddedReply')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply (reply, userId, commentId) {
    const { content } = reply
    const date = new Date()
    const id = `reply-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5,$6) RETURNING id, content, user_id AS owner',
      values: [id, content, date, userId, commentId, false]
    }

    const result = await this._pool.query(query)
    return new AddedReply({ ...result.rows[0] })
  }

  async checkReplyIsExist (id, commentId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      values: [id, commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan di database')
    }
  }

  async verifyOwnerReply (replyId, userId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND user_id = $2',
      values: [replyId, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError('maaf kamu tidak berhak untuk menghapus reply ini')
    }
  }

  async deleteReply (replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted=true WHERE id= $1',
      values: [replyId]
    }

    await this._pool.query(query)
  }
}

module.exports = ReplyRepositoryPostgres
