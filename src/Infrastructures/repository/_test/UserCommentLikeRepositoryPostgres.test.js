const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const pool = require('../../database/postgres/pool')
const UserCommentLikeRepositoryPostgres = require('../UserCommentLikeRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPosgres')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const UserCommentLikesTableTestHelper = require('../../../../tests/UserCommentLikesTableTestHelper')

describe('UserCommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UserCommentLikesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  let tempCommentId
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

    let result
    result = await userRepositoryPostgres.addUser(registerUser)
    result = await threadRepositoryPostgres.addThread(newThread, result.id)
    result = await commentRepositoryPostgres.addComment(newComment, 'user-123', result.id)
    tempCommentId = result.id
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addCommentLike function', () => {
    it('should persist new user comment like correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await userCommentLikeRepositoryPostgres.addCommentLike(tempCommentId, 'user-123')

      // Assert
      const userCommentLikes = await UserCommentLikesTableTestHelper.findUserCommentlikesById('uc_like-123')
      expect(userCommentLikes).toHaveLength(1)
    })
  })

  describe('deleteCommentLike', () => {
    it('should delete comment like correctly', async () => {
      // Arrange
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool)
      await UserCommentLikesTableTestHelper.addCommentLike('uc_like-123', tempCommentId, 'user-123')

      // Action
      await userCommentLikeRepositoryPostgres.deleteCommentLike(tempCommentId, 'user-123')

      // Assert
      const userCommentLikes = await UserCommentLikesTableTestHelper.findUserCommentlikesById('uc_like-123')
      expect(userCommentLikes).toHaveLength(0)
    })
  })

  describe('checkCommentLike', () => {
    it('should return id when id not exist', async () => {
      // Arrange
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action
      const result = await userCommentLikeRepositoryPostgres.checkCommentLike(tempCommentId, 'user-123')

      // Assert
      expect(result).toEqual(false)
    })

    it('should return id when id exist', async () => {
      // Arrange
      await UserCommentLikesTableTestHelper.addCommentLike('uc_like-123')
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {})

      // Action
      const result = await userCommentLikeRepositoryPostgres.checkCommentLike(tempCommentId, 'user-123')

      // Assert
      expect(result).toEqual(true)
    })
  })

  describe('getCommentLikeByCommentId', () => {
    it('should return like count when comment like is found', async () => {
    // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, fakeIdGenerator)

      await userCommentLikeRepositoryPostgres.addCommentLike(tempCommentId, 'user-123')

      // Action
      const likeCount = await userCommentLikeRepositoryPostgres.getCommentLikeByCommentId(tempCommentId)

      // Assert
      expect(likeCount).toEqual(1)
    })
  })
})
