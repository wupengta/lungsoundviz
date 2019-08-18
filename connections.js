const mysql = require('mysql');

module.exports = {
    pool: {},
    init: () => {
        this.pool = mysql.createPool({
            connectionLimit: 1000,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            timezone: 'utc'
        })
    },
    acquire: (cb) => {
        this.pool.getConnection(function (err, conn) {
            cb(err, conn);
        });
    }
}
