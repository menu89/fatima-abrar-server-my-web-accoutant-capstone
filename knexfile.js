// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 require('dotenv').config();

 const username = process.env.DataBaseUseName
 const password = process.env.DataBaseUsePassword

module.exports = {

    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'my_web_accountant',
      user:     `${username}`,
      password: `${password}`,
      charset: 'utf8'
    }

};
