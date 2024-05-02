class LikeCommentUseCase {
  constructor ({ userCommentLikeRepository, commentRepository }) {
    this._userCommentLikeRepository = userCommentLikeRepository
    this._commentRepository = commentRepository
  }

  async execute (useCaseAuth, useCaseParam) {
    await this._commentRepository.checkCommentIsExist(useCaseParam.commentId, useCaseParam.threadId)
    const check = await this._userCommentLikeRepository.checkCommentLike(useCaseParam.commentId, useCaseAuth.id)
    if (check) {
      await this._userCommentLikeRepository.deleteCommentLike(useCaseParam.commentId, useCaseAuth.id)
    } else {
      await this._userCommentLikeRepository.addCommentLike(useCaseParam.commentId, useCaseAuth.id)
    }
  }
}

module.exports = LikeCommentUseCase
