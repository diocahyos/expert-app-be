/* istanbul ignore file */
const config = {
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  jwt: {
    at_key: process.env.ACCESS_TOKEN_KEY,
    rt_key: process.env.REFRESH_TOKEN_KEY,
    at_age: process.env.ACCESS_TOKEN_AGE
  }
}

module.exports = config
