class DeleteReplyUseCase {
  constructor ({
    replyRepository
  }) {
    this._replyRepository = replyRepository
  }

  async execute (useCaseAuth, useCaseParam) {
    const { commentId, replyId } = useCaseParam
    await this._replyRepository.checkReplyIsExist(replyId, commentId)
    await this._replyRepository.verifyOwnerReply(replyId, useCaseAuth.id)
    await this._replyRepository.deleteReply(replyId)
  }
}

module.exports = DeleteReplyUseCase
