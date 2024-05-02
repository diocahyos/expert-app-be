const UserCommentLikeRepository = require('../UserCommentLikeRepository')

describe('UserCommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userCommentLikeRepository = new UserCommentLikeRepository()

    // Action and Assert
    await expect(userCommentLikeRepository.addCommentLike('')).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userCommentLikeRepository.deleteCommentLike('')).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userCommentLikeRepository.getCommentLikeByCommentId('')).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userCommentLikeRepository.checkCommentLike('')).rejects.toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
