const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('/threads/{threadId}/comments/{replyId}/replies endpoint', () => {
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
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123
      }
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai')
    })

    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'some content'
      }
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 404 if reply does not exists', async () => {
      // Arrange
      const server = await createServer(container)
      const id = 'reply-123'
      const token = authToken

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies/${id}`,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('reply tidak ditemukan di database')
    })

    it('should response 403 if the reply is not the owner', async () => {
      // Arrange
      const server = await createServer(container)
      const token = authToken
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123' })
      await RepliesTableTestHelper.addReply({ content: 'dicoding' })
      const id = 'reply-123'
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${id}`,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('maaf kamu tidak berhak untuk menghapus reply ini')
    })

    it('should response 200 if reply exist', async () => {
      // Arrange
      const server = await createServer(container)
      const token = authToken
      const payload = {
        content: 'dicoding'
      }

      const postResponse = await server.inject({
        method: 'POST',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies`,
        payload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const postResponseJson = JSON.parse(postResponse.payload)
      const replyId = postResponseJson.data.addedReply.id

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies/${replyId}`,
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
