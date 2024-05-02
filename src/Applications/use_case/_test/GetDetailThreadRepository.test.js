const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const UserCommentLikeRepository = require('../../../Domains/user_comment_likes/UserCommentLikeRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123'
    }
    const expectedDetailReplyFirst = new DetailReply({
      id: 'reply-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding'
    })

    const expectedDetailReplySecond = new DetailReply({
      id: 'reply-456',
      content: '**balasan telah dihapus**',
      date: 'some date',
      username: 'dicoding'
    })

    const expectedDetailCommentFirst = new DetailComment({
      id: 'comment-123',
      content: 'some content',
      date: 'some date',
      likeCount: 1,
      username: 'dicoding',
      replies: [expectedDetailReplyFirst, expectedDetailReplySecond]
    })

    const expectedDetailCommentSecond = new DetailComment({
      id: 'comment-456',
      content: '**komentar telah dihapus**',
      date: 'some date',
      likeCount: 1,
      username: 'dicoding',
      replies: [expectedDetailReplyFirst, expectedDetailReplySecond]
    })

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding',
      comments: [expectedDetailCommentFirst, expectedDetailCommentSecond]
    })

    const mockGetDetailThreadById = {
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding'
    }

    const likeCount = 1
    const mockGetDetailCommentByThreadId = [
      {
        id: 'comment-123',
        content: 'some content',
        date: 'some date',
        likeCount,
        is_deleted: false,
        username: 'dicoding'
      },
      {
        id: 'comment-456',
        content: '**komentar telah dihapus**',
        date: 'some date',
        likeCount,
        is_deleted: true,
        username: 'dicoding'
      }
    ]

    const mockGetDetailReplyByCommentId = [
      {
        id: 'reply-123',
        content: 'some content',
        date: 'some date',
        is_deleted: false,
        username: 'dicoding'
      },
      {
        id: 'reply-456',
        content: '**balasan telah dihapus**',
        date: 'some date',
        is_deleted: true,
        username: 'dicoding'
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockUserCommentLikeRepository = new UserCommentLikeRepository()

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn(() => mockGetDetailThreadById)
    mockCommentRepository.getDetailCommentByThreadId = jest.fn(() => mockGetDetailCommentByThreadId)
    mockUserCommentLikeRepository.getCommentLikeByCommentId = jest.fn(() => likeCount)
    mockReplyRepository.getDetailReplyByCommentId = jest.fn(() => mockGetDetailReplyByCommentId)

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userCommentLikeRepository: mockUserCommentLikeRepository
    })

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCaseParam)

    // Assert
    expect(detailThread).toStrictEqual(new DetailThread({
      id: expectedDetailThread.id,
      title: expectedDetailThread.title,
      body: expectedDetailThread.body,
      date: expectedDetailThread.date,
      username: expectedDetailThread.username,
      comments: expectedDetailThread.comments
    }))

    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCaseParam.threadId)
    expect(mockCommentRepository.getDetailCommentByThreadId).toBeCalledWith(useCaseParam.threadId)
    expect(mockUserCommentLikeRepository.getCommentLikeByCommentId).toBeCalledWith(expectedDetailCommentFirst.id)
    expect(mockUserCommentLikeRepository.getCommentLikeByCommentId).toBeCalledWith(expectedDetailCommentSecond.id)
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(expectedDetailCommentFirst.id)
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(expectedDetailCommentSecond.id)
  })
})
