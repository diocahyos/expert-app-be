const CommentRepository = require('../../../Domains/comments/CommentRepository')
const UserCommentLikeRepository = require('../../../Domains/user_comment_likes/UserCommentLikeRepository')
const LikeCommentUseCase = require('../LikeCommentUseCase')

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly with condition not yet liked', async () => {
    // Arrange
    const useCaseAuth = {
      id: 'user-123'
    }
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    const mockUserCommentLikeRepository = new UserCommentLikeRepository()
    const mockCommentRepository = new CommentRepository()
    // Mocking
    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockUserCommentLikeRepository.checkCommentLike = jest.fn(() => false)
    mockUserCommentLikeRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // Create the use case instace
    const likeCommentUseCase = new LikeCommentUseCase({
      userCommentLikeRepository: mockUserCommentLikeRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    await likeCommentUseCase.execute(useCaseAuth, useCaseParam)

    // Assert
    expect(mockCommentRepository.checkCommentIsExist)
      .toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId)
    expect(mockUserCommentLikeRepository.checkCommentLike)
      .toBeCalledWith(useCaseParam.commentId, useCaseAuth.id)
    expect(mockUserCommentLikeRepository.addCommentLike)
      .toBeCalledWith(useCaseParam.commentId, useCaseAuth.id)
  })

  it('should orchestrating the like comment action correctly with condition already liked', async () => {
    // Arrange
    const useCaseAuth = {
      id: 'user-123'
    }
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    const mockUserCommentLikeRepository = new UserCommentLikeRepository()
    const mockCommentRepository = new CommentRepository()
    // Mocking
    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockUserCommentLikeRepository.checkCommentLike = jest.fn(() => true)
    mockUserCommentLikeRepository.deleteCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // Create the use case instace
    const likeCommentUseCase = new LikeCommentUseCase({
      userCommentLikeRepository: mockUserCommentLikeRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    await likeCommentUseCase.execute(useCaseAuth, useCaseParam)

    // Assert
    expect(mockCommentRepository.checkCommentIsExist)
      .toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId)
    expect(mockUserCommentLikeRepository.checkCommentLike)
      .toBeCalledWith(useCaseParam.commentId, useCaseAuth.id)
    expect(mockUserCommentLikeRepository.deleteCommentLike)
      .toBeCalledWith(useCaseParam.commentId, useCaseAuth.id)
  })
})
