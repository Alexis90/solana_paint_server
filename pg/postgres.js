const knex = require('knex');
const config = require('./config');

let postgres;

try {
  postgres = knex(config[process.env.APP_ENV]);

  postgres.on('query-error', (error, obj) => {
    console.log(error.message);
    throw new Error('Database error');
  });
} catch (error) {
  throw new Error('Cannot connect to Postgres database');
}

module.exports = postgres;
