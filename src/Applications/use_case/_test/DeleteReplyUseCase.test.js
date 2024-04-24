const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCaseAuth = {
      id: 'user-123'
    }
    const useCaseParam = {
      commentId: 'comment-123',
      replyId: 'reply-123'
    }
    const mockReplyRepository = new ReplyRepository()
    mockReplyRepository.checkReplyIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyOwnerReply = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository
    })

    // Act
    await deleteReplyUseCase.execute(useCaseAuth, useCaseParam)

    // Assert
    expect(mockReplyRepository.checkReplyIsExist)
      .toHaveBeenCalledWith(useCaseParam.replyId, useCaseParam.commentId)
    expect(mockReplyRepository.verifyOwnerReply)
      .toHaveBeenCalledWith(useCaseParam.replyId, useCaseAuth.id)
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCaseParam.replyId)
  })
})
