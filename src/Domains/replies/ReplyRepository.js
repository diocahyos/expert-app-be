class ReplyRepository {
  async addReply (reply, userId, replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkReplyIsExist (replyId, threadId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyOwnerReply (replyId, userId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getDetailReplyByCommentId (commentId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteReply (replyId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ReplyRepository
