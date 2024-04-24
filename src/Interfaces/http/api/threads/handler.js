const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase')
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase')
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this)
    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    this.postReplyHandler = this.postReplyHandler.bind(this)
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this)
  }

  async postThreadHandler (request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute(request.payload, request.auth.credentials)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getDetailThreadHandler (request, h) {
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name)
    const detailThread = await getDetailThreadUseCase.execute(request.params)

    const response = h.response({
      status: 'success',
      data: {
        thread: detailThread
      }
    })
    response.code(200)
    return response
  }

  async postCommentHandler (request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const addedComment = await addCommentUseCase.execute(request.payload, request.auth.credentials, request.params)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    await deleteCommentUseCase.execute(request.auth.credentials, request.params)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }

  async postReplyHandler (request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name)
    const addedReply = await addReplyUseCase.execute(request.payload, request.auth.credentials, request.params)

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler (request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name)
    await deleteReplyUseCase.execute(request.auth.credentials, request.params)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
