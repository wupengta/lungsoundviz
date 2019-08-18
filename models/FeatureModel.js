const connection = require('../connections');

module.exports = {
    findFeatures: function (patient_id, last7Day, today, feature) {

        const sql = `
        select * from file a, feature b 
        where a.file_id = b.file_id 
        and a.patient_id = ? 
        and a.upload_date >= ? 
        and a.upload_date <= ? 
        and b.feature = ?`;

        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, [patient_id, last7Day, today, feature], function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    },
    findSumByPatientAndFeature: function (patient_id, feature) {

        const sql = `
        select a.upload_date, a.time, sum(b.percentage) as percentage, a.upload_date from file a, feature b 
        where 1 = 1
        and a.file_id = b.file_id
        and a.patient_id = ?
        and b.feature = ?
        group by a.upload_date, a.time
        order by 3 desc`;

        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, [patient_id, feature], function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    },
    findPartByPatientAndFeature: function (patient_id, feature) {

        const sql = `
        select a.upload_date, a.time, a.part, b.percentage, a.upload_date from file a, feature b
        where 1 = 1
        and a.file_id = b.file_id
        and a.patient_id = ?
        and b.feature = ?
        order by 4 desc`;

        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, [patient_id, feature], function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });

    }

}
