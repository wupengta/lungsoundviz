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
const moment = require('moment');

const sql = "insert into file (patient_id, part, time, upload_date) values ?";

const patient_id = 1;
const base_date = "2019/12/31";
const times = ['am', 'pm'];
const parts = ["F1", "F2", "F3", "F4", "B1", "B2"];

let datas = [];

for (let i = 0; i <= 365; i++) {

    const day = moment(base_date, "YYYY/MM/DD").subtract(i, 'days').format("YYYY/MM/DD");

    times.forEach(t => {
        parts.forEach(p => {
            datas.push([patient_id, p, t, day]);
        });
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
