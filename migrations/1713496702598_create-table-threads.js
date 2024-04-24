/* eslint-disable camelcase */
exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)'
    }
  })

  pgm.addConstraint('threads', 'fk_threads.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('threads', 'fk_threads.user_id_users.id')
  pgm.dropTable('threads')
}
