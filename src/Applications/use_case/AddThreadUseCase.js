const NewThread = require('../../Domains/threads/entities/NewThread')

class AddThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload, useCaseAuth) {
    const newThread = new NewThread(useCasePayload)
    return this._threadRepository.addThread(newThread, useCaseAuth.id)
  }
}

module.exports = AddThreadUseCase
