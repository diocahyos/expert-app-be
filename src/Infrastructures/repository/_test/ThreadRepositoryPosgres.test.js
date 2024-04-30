const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPosgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
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
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThreadById('thread-12223'))
        .rejects
        .toThrowError(NotFoundError)
    })

    it('should return list detail thread when thread is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      const newThread = new NewThread({
        title: 'dicoding',
        body: 'body thread'
      })

      let result
      result = await threadRepositoryPostgres.addThread(newThread, 'user-123')
      const threadId = result.id

      result = await ThreadsTableTestHelper.findThreadsById(threadId)
      const date = result[0].date

      // Action
      result = await threadRepositoryPostgres.getDetailThreadById(threadId)

      // Assert
      expect(result).toStrictEqual({
        id: threadId,
        title: newThread.title,
        body: newThread.body,
        date,
        username: tempUsername
      })
    })
  })
})
