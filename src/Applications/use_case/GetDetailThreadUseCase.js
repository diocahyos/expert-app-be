class GetDetailThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCaseParam) {
    const { threadId } = useCaseParam
    return this._threadRepository.getDetailThreadById(threadId)
  }
}

module.exports = GetDetailThreadUseCase
