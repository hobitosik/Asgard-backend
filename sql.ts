let mysql = require('mysql');
let host = process.env.HOST || 'localhost';
module.exports = mysql.createPool({
    connectionLimit: 100,
    host: host,
    user: 'asgard',
    password: 'q1w2e3r4t5y6',
    database: 'asgard'
});
