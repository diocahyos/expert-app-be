/* eslint-disable camelcase */
exports.up = pgm => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)'
    },
    comment_id: {
      type: 'VARCHAR(50)'
    },
    is_deleted: {
      type: 'BOOL'
    }
  })

  pgm.addConstraint('replies', 'fk_replies.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE')
  pgm.addConstraint('replies', 'fk_replies.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('replies', 'fk_replies.comment_id_comments.id')
  pgm.dropConstraint('replies', 'fk_replies.user_id_users.id')
  pgm.dropTable('replies')
}
