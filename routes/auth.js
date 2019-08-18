var express = require('express');
var router = express.Router();

//瀏覽器上url路徑(http get method)，開ejs檔案
router.get('/signin', function (req, res, next) {
    res.render('signin', {
        title: '登入|'
    });
});

router.post('/signin', function (req, res) {
    const account = req.body.account;
    const password = req.body.password;

    if (account && password) {

        if (account === "patient" && password === "123") {
            res.json({
                status: "success",
                path: "/patient"
            });
        } else if (account === "doctor" && password === "123") {
            res.json({
                status: "success",
                path: "/doctor"
            });
        } else {
            res.json({
                status: "fail",
                path: "/signin"
            });
        }
    } else {
        res.json({
            status: "fail",
            path: "/signin"
        });
    }

});


module.exports = router;
