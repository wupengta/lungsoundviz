require('dotenv').config();
const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'lungsoundviz',
    connectionLimit: 100,
    acquireTimeout: 1000000
});
// const moment = require('moment');
// const last7Day = moment("2019-06-26T00:00:00.000Z").subtract('6', 'days').format('YYYY/MM/DD');
// console.log(last7Day);

const sql = "insert into feature_section (feature_id, start, end) values ?";

let datas = [];
let basenum = Math.floor(Math.random() * 100);
const section = [
    [7.504, 11.096],
    [14.944, 15.400],
    [16.112, 16.480],
    [17.104, 18.200],
    [19.552, 20.408],
    [21.520, 22.032],
    [22.800, 24.720],
    [26.896, 28.040],
    [29.440, 29.600]
];

for (let i = 1; i <= 17568; i++) {
    section.forEach(s => {
        datas.push([i, s[0], s[1]]);
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
            console.error(err.stack);
            return;
        };
        console.log(res);
        connection.release();
    });
});
