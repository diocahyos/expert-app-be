class DetailComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, content, date, username, replies } = payload

    this.id = id
    this.content = content
    this.date = date
    this.username = username
    this.replies = replies
  }

  _verifyPayload ({ id, content, date, username, replies }) {
    if (!id || !content || !date || !username || !replies) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' ||
        typeof username !== 'string' || typeof replies !== 'object') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailComment