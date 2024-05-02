const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  let authToken
  let tempThreadId
  let tempCommentId

  beforeEach(async () => {
    const requestPayload = {
      username: 'dicodingv1',
      password: 'secretv1'
    }
    const server = await createServer(container)
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicodingv1',
        password: 'secretv1',
        fullname: 'Dicoding Indonesia V1'
      }
    })

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload
    })

    const responseJson = JSON.parse(response.payload)
    authToken = responseJson.data.accessToken

    const requestPayloadThread = {
      title: 'dicoding',
      body: 'body thread'
    }

    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayloadThread,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    const responseThreadJson = JSON.parse(responseThread.payload)
    tempThreadId = responseThreadJson.data.addedThread.id

    const requestPayloadComment = {
      content: 'dicoding'
    }

    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${tempThreadId}/comments`,
      payload: requestPayloadComment,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    const responseCommentJson = JSON.parse(responseComment.payload)
    tempCommentId = responseCommentJson.data.addedComment.id
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted comment', async () => {
      // Arrange
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/likes`,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
