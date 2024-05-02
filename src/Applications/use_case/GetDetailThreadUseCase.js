const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')
const DetailThread = require('../../Domains/threads/entities/DetailThread')

class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (useCaseParam) {
    const { threadId } = useCaseParam
    const detailThread = await this._threadRepository.getDetailThreadById(threadId)
    const detailComment = await this._commentRepository.getDetailCommentByThreadId(threadId)

    console.log('CEK DATA, ', detailThread.id)

    const thread = new DetailThread({
      id: detailThread.id,
      title: detailThread.title,
      body: detailThread.body,
      date: detailThread.date,
      username: detailThread.username,
      comments: []
    })

    let indexComment = 0
    let contentComment
    let contentReply
    for (const comment of detailComment) {
      if (comment.is_deleted) {
        contentComment = '**komentar telah dihapus**'
      } else {
        contentComment = comment.content
      }

      const commentObject = new DetailComment({
        id: comment.id,
        content: contentComment,
        date: comment.date,
        username: comment.username,
        replies: []
      })

      thread.comments.push(commentObject)
      const detailReply = await this._replyRepository.getDetailReplyByCommentId(comment.id)
      detailReply.forEach(reply => {
        if (reply.is_deleted) {
          contentReply = '**balasan telah dihapus**'
        } else {
          contentReply = reply.content
        }
        const replyObject = new DetailReply({
          id: reply.id,
          content: contentReply,
          date: reply.date,
          username: reply.username
        })
        thread.comments[indexComment].replies.push(replyObject)
      })
      indexComment++
    }

    return thread
  }
}

module.exports = GetDetailThreadUseCase
