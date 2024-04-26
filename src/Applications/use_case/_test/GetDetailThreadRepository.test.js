const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should set the action of the detail thread with comments is null correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123'
    }

    const expectedDetailThread = new DetailThread({
      id: 'thread-1233',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding',
      comments: []
    })

    const mockGetDetailThreadById = [
      {
        id: 'thread-1233',
        title: 'some title',
        body: 'some body',
        date: 'some date',
        username: 'dicoding'
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn(() => mockGetDetailThreadById)
    mockCommentRepository.getDetailCommentByThreadId = jest.fn(() => [])

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
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
  })

  it('should set the action of the detail thread with the deleted comment correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123'
    }

    const expectedDetailCommentFirst = new DetailComment({
      id: 'comment-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding',
      replies: []
    })

    const expectedDetailCommentSecond = new DetailComment({
      id: 'comment-456',
      content: '**komentar telah dihapus**',
      date: 'some date',
      username: 'dicoding',
      replies: []
    })

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding',
      comments: [expectedDetailCommentFirst, expectedDetailCommentSecond]
    })

    const mockGetDetailThreadById = [
      {
        id: 'thread-123',
        title: 'some title',
        body: 'some body',
        date: 'some date',
        username: 'dicoding'
      }
    ]

    const mockGetDetailCommentByThreadId = [
      {
        id: 'comment-123',
        content: 'some content',
        date: 'some date',
        is_deleted: false,
        username: 'dicoding'
      },
      {
        id: 'comment-456',
        content: '**komentar telah dihapus**',
        date: 'some date',
        is_deleted: true,
        username: 'dicoding'
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn(() => mockGetDetailThreadById)
    mockCommentRepository.getDetailCommentByThreadId = jest.fn(() => mockGetDetailCommentByThreadId)
    mockReplyRepository.getDetailReplyByCommentId = jest.fn(() => [])

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
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

    expect(detailThread.comments[0]).toStrictEqual(new DetailComment({
      id: expectedDetailCommentFirst.id,
      content: expectedDetailCommentFirst.content,
      date: expectedDetailCommentFirst.date,
      username: expectedDetailCommentFirst.username,
      replies: []
    }))

    expect(detailThread.comments[1]).toStrictEqual(new DetailComment({
      id: expectedDetailCommentSecond.id,
      content: expectedDetailCommentSecond.content,
      date: expectedDetailCommentSecond.date,
      username: expectedDetailCommentSecond.username,
      replies: []
    }))

    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCaseParam.threadId)
    expect(mockCommentRepository.getDetailCommentByThreadId).toBeCalledWith(useCaseParam.threadId)
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(mockGetDetailCommentByThreadId[0].id)
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(mockGetDetailCommentByThreadId[1].id)
  })

  it('should set the action of the detail thread with the deleted reply correctly', async () => {
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

    const expectedDetailComment = new DetailComment({
      id: 'comment-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding',
      replies: [expectedDetailReplyFirst, expectedDetailReplySecond]
    })

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding',
      comments: [expectedDetailComment]
    })

    const mockGetDetailThreadById = [
      {
        id: 'thread-123',
        title: 'some title',
        body: 'some body',
        date: 'some date',
        username: 'dicoding'
      }
    ]

    const mockGetDetailCommentByThreadId = [
      {
        id: 'comment-123',
        content: 'some content',
        date: 'some date',
        is_deleted: false,
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

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn(() => mockGetDetailThreadById)
    mockCommentRepository.getDetailCommentByThreadId = jest.fn(() => mockGetDetailCommentByThreadId)
    mockReplyRepository.getDetailReplyByCommentId = jest.fn(() => mockGetDetailReplyByCommentId)

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
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

    expect(detailThread.comments[0]).toStrictEqual(new DetailComment({
      id: expectedDetailComment.id,
      content: expectedDetailComment.content,
      date: expectedDetailComment.date,
      username: expectedDetailComment.username,
      replies: expectedDetailComment.replies
    }))

    expect(detailThread.comments[0].replies[0]).toStrictEqual(new DetailReply({
      id: expectedDetailReplyFirst.id,
      content: expectedDetailReplyFirst.content,
      date: expectedDetailReplyFirst.date,
      username: expectedDetailReplyFirst.username
    }))

    expect(detailThread.comments[0].replies[1]).toStrictEqual(new DetailReply({
      id: expectedDetailReplySecond.id,
      content: expectedDetailReplySecond.content,
      date: expectedDetailReplySecond.date,
      username: expectedDetailReplySecond.username
    }))

    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCaseParam.threadId)
    expect(mockCommentRepository.getDetailCommentByThreadId).toBeCalledWith(useCaseParam.threadId)
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(expectedDetailComment.id)
  })

  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123'
    }
    const expectedDetailReply = new DetailReply({
      id: 'reply-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding'
    })

    const expectedDetailComment = new DetailComment({
      id: 'comment-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding',
      replies: [expectedDetailReply]
    })

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding',
      comments: [expectedDetailComment]
    })

    const mockGetDetailThreadById = [
      {
        id: 'thread-123',
        title: 'some title',
        body: 'some body',
        date: 'some date',
        username: 'dicoding'
      }
    ]

    const mockGetDetailCommentByThreadId = [
      {
        id: 'comment-123',
        content: 'some content',
        date: 'some date',
        is_deleted: false,
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
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn(() => mockGetDetailThreadById)
    mockCommentRepository.getDetailCommentByThreadId = jest.fn(() => mockGetDetailCommentByThreadId)
    mockReplyRepository.getDetailReplyByCommentId = jest.fn(() => mockGetDetailReplyByCommentId)

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
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

    expect(detailThread.comments[0]).toStrictEqual(new DetailComment({
      id: expectedDetailComment.id,
      content: expectedDetailComment.content,
      date: expectedDetailComment.date,
      username: expectedDetailComment.username,
      replies: expectedDetailComment.replies
    }))

    expect(detailThread.comments[0].replies[0]).toStrictEqual(new DetailReply({
      id: expectedDetailReply.id,
      content: expectedDetailReply.content,
      date: expectedDetailReply.date,
      username: expectedDetailReply.username
    }))

    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCaseParam.threadId)
    expect(mockCommentRepository.getDetailCommentByThreadId).toBeCalledWith(useCaseParam.threadId)
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(expectedDetailComment.id)
  })
})
