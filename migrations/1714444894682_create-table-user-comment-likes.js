exports.up = pgm => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(50)'
    },
    comment_id: {
      type: 'VARCHAR(50)'
    }
  })

  pgm.addConstraint('user_comment_likes', 'unique_user_id_and_comment_id', 'UNIQUE(user_id, comment_id)')

  pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE')
  pgm.addConstraint('user_comment_likes', 'fk_user_comment_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.user_id_users.id')
  pgm.dropConstraint('user_comment_likes', 'fk_user_comment_likes.comment_id_comments.id')
  pgm.dropTable('user_comment_likes')
}
