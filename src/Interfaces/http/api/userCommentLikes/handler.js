const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase')

class UserCommentLikesHandler {
  constructor (container) {
    this._container = container

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this)
  }

  async putCommentLikeHandler (request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name)
    await likeCommentUseCase.execute(request.auth.credentials, request.params)

    const response = h.response({ status: 'success' })
    response.code(200)
    return response
  }
}

module.exports = UserCommentLikesHandler
