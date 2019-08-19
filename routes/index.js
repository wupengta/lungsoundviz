const express = require('express');
const router = express.Router();
const math = require('mathjs');
const fs = require('fs');
const AudioContext = require('web-audio-api').AudioContext
const context = new AudioContext
const indexController = require('../controllers/IndexController');

/* GET home page. */
//瀏覽器上url路徑，開index.ejs檔案
router.get('/', indexController.index);

router.get('/review', indexController.review);

router.get('/getAllPatients', indexController.findAllPatients);

//Ajax呼叫 拿特徵資料
router.get('/getFeatures', indexController.getFeatures);

//Ajax呼叫 拿特徵資料
router.get('/getFeatureSection', indexController.getFeatureSection);

//Ajax呼叫 拿CaseByDayTable的資料
router.get('/getCaseByDayData', indexController.getCaseByDayData);

//Ajax呼叫 拿CaseByPartTable的資料
router.get('/getCaseByPartData', indexController.getCaseByPartData);



module.exports = router;
