/* istanbul ignore file */
const config = {
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  database_test: {
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    password: process.env.PGPASSWORD_TEST,
    database: process.env.PGDATABASE_TEST
  },
  jwt: {
    at_key: process.env.ACCESS_TOKEN_KEY,
    rt_key: process.env.REFRESH_TOKEN_KEY,
    at_age: process.env.ACCESS_TOKEN_AGE
  }
}

module.exports = config
