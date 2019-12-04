const mysql = require('mysql2');
const config = require('config');
const pool = mysql.createPool({
  host: config.get('db.host'),
  user: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool;