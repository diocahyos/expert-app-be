const NewComment = require('../../Domains/comments/entities/NewComment')

class AddCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload, useCaseAuth, useCaseParam) {
    const newComment = new NewComment(useCasePayload)
    await this._threadRepository.checkThreadIsExist(useCaseParam.threadId)
    return this._commentRepository.addComment(newComment, useCaseAuth.id, useCaseParam.threadId)
  }
}

module.exports = AddCommentUseCase
