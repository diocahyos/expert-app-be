const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPosgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  let tempUsername
  beforeEach(async () => {
    const registerUser = new RegisterUser({
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Indonesia'
    })

    const fakeIdGenerator = () => '123' // stub!
    const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

    const result = await userRepositoryPostgres.addUser(registerUser)
    tempUsername = result.username
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist new thread and return added thred correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding',
        body: 'body thread'
      })

      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(newThread, 'user-123')

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding',
        body: 'body thread'
      })

      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread, 'user-123')

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123'
      }))
    })

    describe('checkThreadIsExist', () => {
      it('should throw NotFoundError when id not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        // Action & Assert
        await expect(threadRepositoryPostgres.checkThreadIsExist('thread-123'))
          .rejects
          .toThrowError(NotFoundError)
      })

      it('should not throw NotFoundError when id exist', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'dicoding',
          body: 'body thread'
        })

        await ThreadsTableTestHelper.addThread(newThread, 'user-123')
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        // Action & Assert
        await expect(threadRepositoryPostgres.checkThreadIsExist('thread-123')).resolves.not.toThrowError(NotFoundError)
      })
    })

    describe('getDetailThreadById', () => {
      it('should throw InvariantError when thread not found', () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        // Action & Assert
        return expect(threadRepositoryPostgres.getDetailThreadById('thread-12223'))
          .rejects
          .toThrowError(NotFoundError)
      })

      it('should return detail thread when thread is found', async () => {
        // Arrange
        const fakeIdGenerator = () => '123' // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

        const newThread = new NewThread({
          title: 'dicoding',
          body: 'body thread'
        })
        const newComment = new NewComment({
          content: 'some comment'
        })
        const newReply = new NewReply({
          content: 'some reply'
        })

        let result
        result = await threadRepositoryPostgres.addThread(newThread, 'user-123')
        const threadId = result.id
        result = await commentRepositoryPostgres.addComment(newComment, 'user-123', threadId)
        const commentId = result.id
        result = await replyRepositoryPostgres.addReply(newReply, 'user-123', commentId)
        const replyId = result.id

        // Action
        const thread = await threadRepositoryPostgres.getDetailThreadById(threadId)

        // Assert
        expect(thread.id).toBe(threadId)
        expect(thread.title).toBe(newThread.title)
        expect(thread.body).toBe(newThread.body)
        expect(thread.username).toBe(tempUsername)
        expect(thread.comments[0].id).toBe(commentId)
        expect(thread.comments[0].content).toBe(newComment.content)
        expect(thread.comments[0].username).toBe(tempUsername)
        expect(thread.comments[0].replies[0].id).toBe(replyId)
        expect(thread.comments[0].replies[0].content).toBe(newReply.content)
        expect(thread.comments[0].replies[0].username).toBe(tempUsername)
      })
    })
  })
})
