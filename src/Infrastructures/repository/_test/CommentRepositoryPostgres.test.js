const AddedComment = require('../../../Domains/comments/entities/AddedComment')
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
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
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

    const fakeIdGenerator = () => '123' // stub!
    const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

    await userRepositoryPostgres.addUser(registerUser)
    await threadRepositoryPostgres.addThread(newThread, 'user-123')
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'dicoding'
      })

      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentRepositoryPostgres.addComment(newComment, 'user-123', 'thread-123')

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123')
      expect(comments).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'dicoding'
      })

      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment, 'user-123', 'thread-123')

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-123'
      }))
    })
  })

  describe('checkCommentIsExist', () => {
    it('should throw NotFoundError when id not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentIsExist('comment-123', 'thread-123'))
        .rejects
        .toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when id exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ content: 'dicoding' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentIsExist('comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyOwnerComment', () => {
    it('should throw AuthorizationError when comment is not the owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ content: 'dicoding' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwnerComment('comment-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when the comment is the owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ content: 'dicoding' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwnerComment('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteComment', () => {
    it('should delete comment with is_deleted = true', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool)
      await CommentsTableTestHelper.addComment({ content: 'dicoding' })

      // Action
      await commentRepository.deleteComment('comment-123')

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123')
      expect(comments[0].is_deleted).toEqual(true)
    })
  })
})