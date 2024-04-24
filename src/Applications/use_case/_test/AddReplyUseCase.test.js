const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddReplyUseCase = require('../AddReplyUseCase')

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding'
    }
    const useCaseAuth = {
      id: 'user-123'
    }

    const useCaseParam = {
      commentId: 'comment-123',
      threadId: 'thread-123'
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCaseAuth.id
    })

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload, useCaseAuth, useCaseParam)

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCaseAuth.id
    }))

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId)
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content
    }), useCaseAuth.id, useCaseParam.commentId)
  })
})
