const DetailReply = require('../DetailReply')

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: '1232',
      content: '123'
    }

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      content: 123,
      date: 2023,
      username: 234
    }

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DetailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-AqVg2b9JyQXR6wSQ2TmH4',
      content: 'sebuah reply',
      date: '2021-08-08T07:59:16.198Z',
      username: 'dicoding'
    }

    // Action
    const detailReply = new DetailReply(payload)

    // Assert
    expect(detailReply.id).toEqual(payload.id)
    expect(detailReply.content).toEqual(payload.content)
    expect(detailReply.date).toEqual(payload.date)
    expect(detailReply.username).toEqual(payload.username)
  })
})
