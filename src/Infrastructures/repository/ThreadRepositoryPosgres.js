const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread (thread, userId) {
    const { title, body } = thread
    const date = new Date()
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id AS owner',
      values: [id, title, body, date, userId]
    }

    const result = await this._pool.query(query)
    return new AddedThread({ ...result.rows[0] })
  }

  async checkThreadIsExist (id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan di database')
    }
  }

  async getDetailThreadById (id) {
    const query = {
      text: `
        SELECT
          threads.id,
          threads.title,
          threads.body,
          threads.date,
          users.username
        FROM threads
        LEFT JOIN users ON threads.user_id = users.id
        WHERE threads.id = $1
      `,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Detail Thread tidak ditemukan di dalam database')
    }

    return result.rows
  }
}

module.exports = ThreadRepositoryPostgres
