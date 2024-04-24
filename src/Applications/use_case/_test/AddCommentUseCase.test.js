const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding'
    }
    const useCaseAuth = {
      id: 'user-123'
    }

    const useCaseParam = {
      threadId: 'thread-123'
    }

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCaseAuth.id
    })

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.checkThreadIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload, useCaseAuth, useCaseParam)

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCaseAuth.id
    }))

    expect(mockThreadRepository.checkThreadIsExist).toBeCalledWith(useCaseParam.threadId)
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content
    }), useCaseAuth.id, useCaseParam.threadId)
  })
})
