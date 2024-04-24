const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123'
    }
    const mockDetailReply = new DetailReply({
      id: 'reply-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding'
    })

    const mockDetailComment = new DetailComment({
      id: 'comment-123',
      content: 'some content',
      date: 'some date',
      username: 'dicoding',
      replies: [mockDetailReply]
    })

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: 'some date',
      username: 'dicoding',
      comments: [mockDetailComment]
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread))

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCaseParam)

    // Assert
    expect(detailThread).toStrictEqual(new DetailThread({
      id: mockDetailThread.id,
      title: mockDetailThread.title,
      body: mockDetailThread.body,
      date: mockDetailThread.date,
      username: mockDetailThread.username,
      comments: [mockDetailComment]
    }))

    expect(detailThread.comments[0]).toStrictEqual(new DetailComment({
      id: mockDetailComment.id,
      content: mockDetailComment.content,
      date: mockDetailComment.date,
      username: mockDetailComment.username,
      replies: [mockDetailReply]
    }))

    expect(detailThread.comments[0].replies[0]).toStrictEqual(new DetailReply({
      id: mockDetailReply.id,
      content: mockDetailReply.content,
      date: mockDetailReply.date,
      username: mockDetailReply.username
    }))

    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(useCaseParam.threadId)
  })
})
