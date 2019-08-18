const connection = require('../connections');

module.exports = {
    findPatientById: function (patient_id) {
        let result = {};
        let sql = "select * from patient where patient_id = ?";
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, patient_id, function (err, rows) {
                    if (err) {
                        result.status = "查詢失敗。";
                        result.err = "伺服器錯誤，請稍後再試！";
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    },
    findAllPatients: function () {
        let sql = "select * from patient";
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
}
