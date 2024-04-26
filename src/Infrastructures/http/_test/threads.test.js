const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  let authToken
  let tempUsername
  beforeEach(async () => {
    const requestPayload = {
      username: 'dicodingv1',
      password: 'secretv1'
    }
    const server = await createServer(container)
    // add user
    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicodingv1',
        password: 'secretv1',
        fullname: 'Dicoding Indonesia V1'
      }
    })

    const responseJsonUser = JSON.parse(responseUser.payload)
    tempUsername = responseJsonUser.data.addedUser.username

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload
    })

    const responseJson = JSON.parse(response.payload)
    authToken = responseJson.data.accessToken
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding'
      }
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: ['body thread']
      }
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'body thread'
      }
      const token = authToken

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when thread is not found', async () => {
      // Arrage
      const threadId = 'thread-123'

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Detail Thread tidak ditemukan di dalam database')
    })

    it('should response 200 when thread is found', async () => {
      // Arrange

      // eslint-disable-next-line no-undef
      const server = await createServer(container)

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
      const tempThreadId = responseThreadJson.data.addedThread.id

      // const requestPayloadComment = {
      //   content: 'dicoding'
      // }
      // const responseComment = await server.inject({
      //   method: 'POST',
      //   url: `/threads/${tempThreadId}/comments`,
      //   payload: requestPayloadComment,
      //   headers: {
      //     authorization: `Bearer ${authToken}`
      //   }
      // })

      // const responseCommentJson = JSON.parse(responseComment.payload)
      // const tempCommentId = responseCommentJson.data.addedComment.id

      // const requestPayloadReply = {
      //   content: 'dicoding'
      // }
      // const responseReply = await server.inject({
      //   method: 'POST',
      //   url: `/threads/${tempThreadId}/comments/${tempCommentId}/replies`,
      //   payload: requestPayloadReply,
      //   headers: {
      //     authorization: `Bearer ${authToken}`
      //   }
      // })

      // const responseReplyJson = JSON.parse(responseReply.payload)
      // const tempReplyId = responseReplyJson.data.addedReply.id

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${tempThreadId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()

      const thread = responseJson.data.thread
      expect(thread.id).toEqual(tempThreadId)
      expect(thread.title).toEqual(requestPayloadThread.title)
      expect(thread.body).toEqual(requestPayloadThread.body)
      expect(thread.username).toEqual(tempUsername)
      // expect(thread.comments[0].id).toEqual(tempCommentId)
      // expect(thread.comments[0].content).toEqual(requestPayloadComment.content)
      // expect(thread.comments[0].username).toEqual(tempUsername)

      // expect(thread.comments[0].replies[0].id).toEqual(tempReplyId)
      // expect(thread.comments[0].replies[0].content).toEqual(requestPayloadReply.content)
      // expect(thread.comments[0].replies[0].username).toEqual(tempUsername)
    })
  })
})
