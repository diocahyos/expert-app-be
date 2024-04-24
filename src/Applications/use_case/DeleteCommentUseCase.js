class DeleteCommentUseCase {
  constructor ({
    commentRepository
  }) {
    this._commentRepository = commentRepository
  }

  async execute (useCaseAuth, useCaseParam) {
    const { threadId, commentId } = useCaseParam
    await this._commentRepository.checkCommentIsExist(commentId, threadId)
    await this._commentRepository.verifyOwnerComment(commentId, useCaseAuth.id)
    await this._commentRepository.deleteComment(commentId)
  }
}

module.exports = DeleteCommentUseCase
