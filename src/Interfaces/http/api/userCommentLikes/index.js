const UserCommentLikesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'userCommentLikes',
  register: async (server, { container }) => {
    const userCommentLikesHandler = new UserCommentLikesHandler(container)
    server.route(routes(userCommentLikesHandler))
  }
}
