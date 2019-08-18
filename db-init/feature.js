require('dotenv').config();
const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'lungsoundviz',
    connectionLimit: 100,
    acquireTimeout: 1000000
});
// const moment = require('moment');
// const last7Day = moment("2019-06-26T00:00:00.000Z").subtract('6', 'days').format('YYYY/MM/DD');
// console.log(last7Day);

const sql = "insert into feature (file_id, feature, percentage) values ?";

const feature = ['wheeze', 'finecrackle', 'coarsecrackle', 'rhonchi'];

let datas = [];
let basenum = Math.floor(Math.random() * 100);

for (let i = 1; i <= 4392; i++) {
    feature.forEach(f => {
        datas.push([i, f, Math.floor(Math.random() * basenum)]);
    });
}

// console.log(datas);

pool.getConnection(function (err, connection) {

    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };
    connection.query(sql, [datas], function (err, res) {
        if (err) {
            console.error('error insert_sql: ' + err.stack);
            return;
        };
        console.log(res);
        connection.release();
    });
});
