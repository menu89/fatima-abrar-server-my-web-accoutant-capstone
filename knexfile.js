// Update with your config settings.
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

//use all caps in the env files for variable names
username = process.env.DATABASEUSERNAME
password = process.env.DATABASEPASSWORD

const connections = {
  development:{
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'my_web_accountant',
      user:     username,
      password: password,
      charset: 'utf8'
    }
  },
  production: {
    client:'mysql',
    connection: process.env.JAWSDB_URL
  }
}

module.exports = 
  process.env.NODE_ENV === 'production'
  ? connections.production
  : connections.development
;
