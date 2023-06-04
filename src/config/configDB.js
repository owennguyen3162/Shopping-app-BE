// get the client
const mysql = require("mysql2");

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "shoppingapp",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
const promisePool = connection.promise();
module.exports = promisePool;