const config = require("./index");

const db = config.db;
const username = db.username;
const password = db.password;
const database = db.database;
const host = db.host;
const logging = false;

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect: "postgres",
  },
  test: {
    username,
    password,
    database,
    host,
    logging,
    dialect: "postgres",
  },
  production: {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    },
    use_env_variable: 'DATABASE_URL',
  }
};
