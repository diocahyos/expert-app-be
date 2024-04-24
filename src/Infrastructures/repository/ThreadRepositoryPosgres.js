const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const DetailThread = require('../../Domains/threads/entities/DetailThread')

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
          users.username,
          comments.id AS comment_id,
          CASE
            WHEN comments.is_deleted = true THEN '**komentar telah dihapus**'
            ELSE comments.content
          END AS comment_content,
          comments.date AS comment_date,
          uc.username AS comment_username,
          replies.id AS reply_id,
          CASE
            WHEN replies.is_deleted = true THEN '**balasan telah dihapus**'
            ELSE replies.content
          END AS reply_content,
          replies.date AS reply_date,
          replies.comment_id AS reply_commentId,
          ur.username AS reply_username
        FROM threads
        LEFT JOIN users ON threads.user_id = users.id
        LEFT JOIN comments ON threads.id = comments.thread_id
        LEFT JOIN users uc ON comments.user_id = uc.id
        LEFT JOIN replies ON comments.id = replies.comment_id
        LEFT JOIN users ur on replies.user_id = ur.id
        WHERE threads.id = $1
        ORDER BY comments.date, replies.date 
      `,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Detail Thread tidak ditemukan di dalam database')
    }

    const thread = new DetailThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].date,
      username: result.rows[0].username,
      comments: []
    })

    let tempCommentId = '1'
    let comment
    if (result.rows[0].comment_id !== null) {
      result.rows.forEach(item => {
        if (tempCommentId === item.comment_id && item.reply_id !== null) {
          const reply = new DetailReply({
            id: item.reply_id,
            content: item.reply_content,
            date: item.reply_date,
            username: item.reply_username
          })
          comment.replies.push(reply)
        } else {
          comment = new DetailComment({
            id: item.comment_id,
            content: item.comment_content,
            date: item.comment_date,
            username: item.comment_username,
            replies: []
          })
          if (item.reply_id !== null) {
            const reply = new DetailReply({
              id: item.reply_id,
              content: item.reply_content,
              date: item.reply_date,
              username: item.reply_username
            })
            comment.replies.push(reply)
          }
          thread.comments.push(comment)
          tempCommentId = item.comment_id
        }
      })
    }

    return thread
  }
}

module.exports = ThreadRepositoryPostgres
