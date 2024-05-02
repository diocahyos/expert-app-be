class DetailComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, content, date, likeCount, username, replies } = payload

    this.id = id
    this.content = content
    this.date = date
    this.likeCount = likeCount
    this.username = username
    this.replies = replies
  }

  _verifyPayload ({ id, content, date, likeCount, username, replies }) {
    if (!id || !content || !date || !username) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' ||
        typeof likeCount !== 'number' || typeof username !== 'string' || typeof replies !== 'object') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailComment
