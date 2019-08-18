const connection = require('../connections');

module.exports = {
    findAllByPatientId: function (patient_id, today, last7Day) {
        let result = {};
        let sql = "select * from file where patient_id = ? and upload_date <= ? and upload_date >= ?";
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, [patient_id, today, last7Day], function (err, rows) {
                    if (err) {
                        result.status = "查詢失敗。";
                        result.err = "伺服器錯誤，請稍後再試！";
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
}
