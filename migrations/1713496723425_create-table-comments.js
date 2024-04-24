/* eslint-disable camelcase */
exports.up = pgm => {
  pgm.createTable('comments', {
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
    thread_id: {
      type: 'VARCHAR(50)'
    },
    is_deleted: {
      type: 'BOOL'
    }
  })

  pgm.addConstraint('comments', 'fk_comments.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE')
  pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id')
  pgm.dropConstraint('comments', 'fk_comments.user_id_users.id')
  pgm.dropTable('comments')
}
