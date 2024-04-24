const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseAuth = {
      id: 'user-123'
    }
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }
    const mockCommentRepository = new CommentRepository()
    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyOwnerComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository
    })

    // Act
    await deleteCommentUseCase.execute(useCaseAuth, useCaseParam)

    // Assert
    expect(mockCommentRepository.checkCommentIsExist)
      .toHaveBeenCalledWith(useCaseParam.commentId, useCaseParam.threadId)
    expect(mockCommentRepository.verifyOwnerComment)
      .toHaveBeenCalledWith(useCaseParam.commentId, useCaseAuth.id)
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCaseParam.commentId)
  })
})
