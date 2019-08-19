const connection = require('../connections');

module.exports = {
    findFeatureSectionById: function (feature_id) {

        const sql = `select * from feature_section where feature_id = ?`;

        return new Promise((resolve, reject) => {
            connection.acquire(function (err, conn) {
                conn.query(sql, [feature_id], function (err, rows) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
}
