const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPosgres')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  beforeEach(async () => {
    const registerUser = new RegisterUser({
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Indonesia'
    })
    const newThread = new NewThread({
      title: 'dicoding',
      body: 'body thread'
    })
    const newComment = new NewComment({
      content: 'some comment'
    })

    const fakeIdGenerator = () => '123' // stub!
    const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

    await userRepositoryPostgres.addUser(registerUser)
    await threadRepositoryPostgres.addThread(newThread, 'user-123')
    await commentRepositoryPostgres.addComment(newComment, 'user-123', 'thread-123')
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'dicoding'
      })

      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await replyRepositoryPostgres.addReply(newReply, 'user-123', 'comment-123')

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123')
      expect(replies).toHaveLength(1)
    })

    it('should return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'dicoding'
      })

      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply, 'user-123', 'comment-123')

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'dicoding',
        owner: 'user-123'
      }))
    })
  })

  describe('checkReplyIsExist', () => {
    it('should throw NotFoundError when id not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.checkReplyIsExist('reply-123', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when id exist', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ content: 'dicoding' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.checkReplyIsExist('reply-123', 'comment-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyOwnerReply', () => {
    it('should throw AuthorizationError when reply is not the owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ content: 'dicoding' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwnerReply('reply-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when the reply is the owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ content: 'dicoding' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyOwnerReply('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReply', () => {
    it('should delete reply with is_deleted = true', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool)
      await RepliesTableTestHelper.addReply({ content: 'dicoding' })

      // Action
      await replyRepository.deleteReply('reply-123')

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123')
      expect(replies[0].is_deleted).toEqual(true)
    })
  })
})
