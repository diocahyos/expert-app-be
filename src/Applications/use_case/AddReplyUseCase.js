const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
  constructor ({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload, useCaseAuth, useCaseParam) {
    const newReply = new NewReply(useCasePayload)
    await this._commentRepository.checkCommentIsExist(useCaseParam.commentId, useCaseParam.threadId)
    return this._replyRepository.addReply(newReply, useCaseAuth.id, useCaseParam.commentId)
  }
}

module.exports = AddReplyUseCase
