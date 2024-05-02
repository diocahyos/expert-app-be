const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: '1232',
      content: '123'
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      content: 123,
      date: 2023,
      likeCount: 0,
      username: 234,
      replies: 'comment'
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-AqVg2b9JyQXR6wSQ2TmH4',
      content: 'sebuah comment',
      date: '2021-08-08T07:59:16.198Z',
      likeCount: 0,
      username: 'dicoding',
      replies: [{}]
    }

    // Action
    const detailComment = new DetailComment(payload)

    // Assert
    expect(detailComment.id).toEqual(payload.id)
    expect(detailComment.content).toEqual(payload.content)
    expect(detailComment.date).toEqual(payload.date)
    expect(detailComment.likeCount).toEqual(payload.likeCount)
    expect(detailComment.username).toEqual(payload.username)
    expect(detailComment.replies).toEqual(payload.replies)
  })
})
