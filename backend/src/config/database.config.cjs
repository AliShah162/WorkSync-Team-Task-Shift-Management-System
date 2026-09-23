// backend/src/config/database.config.cjs
require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      match: [/Connection terminated unexpectedly/],
      max: 3,
    },
    logging: false,
  },
  test: { /* same as development */ },
  production: { /* same as development */ },
};