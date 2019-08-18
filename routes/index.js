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

//Ajax呼叫 拿CaseByDayTable的資料
router.get('/getCaseByDayData', indexController.getCaseByDayData);

//Ajax呼叫 拿CaseByPartTable的資料
router.get('/getCaseByPartData', indexController.getCaseByPartData);

// 讀音檔
function decodeSoundFile(soundfile) {
  return new Promise(function (resolve, reject) {
    fs.readFile(soundfile, function (err, buf) {
      if (err) throw err;
      context.decodeAudioData(buf, function (audioBuffer) {
        console.log(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate, audioBuffer.duration);
        const pcmdata = audioBuffer.getChannelData(0);
        samplerate = audioBuffer.sampleRate;
        console.log("sample rate:" + samplerate);
        resolve(pcmdata);
      }, function (err) {
        throw err
      })
    });
  });
}

router.get('/audio', async function (req, res, next) {

  const patientId = req.query.patientId;
  const date = req.query.date;
  const time = req.query.time;
  const part = req.query.part;

  const audioFile = './sounds/' + patientId + '_' + date + '_' + time + '_' + part + '.wav';
  console.log(audioFile);
  const pcmdata = await decodeSoundFile(audioFile);
  res.json(pcmdata);

});


function ACF(frame) {
  let acf = [];
  for (let i = 0; i < frame.length; i++) {

    const arr1 = Array.prototype.slice.call(frame.slice(i, frame.length));
    const arr2 = Array.prototype.slice.call(frame.slice(0, frame.length - i));

    const inner = math.dot(arr1, arr2);
    acf.push(inner);
  }
  return acf;
}

router.get('/testacf', async function (req, res, next) {

  const soundfile = "./sounds/00001_20190627_am_F2.wav";
  let pcmdata = await decodeSoundFile(soundfile);
  const frame = 128;
  let count = req.query.count;
  let acfArr = [];

  const frame_from = count * frame / 2;
  const frame_to = (count * frame / 2) + frame;
  const acf = ACF(pcmdata.slice(frame_from, frame_to));
  console.log("第" + count + "個  frame_from:" + frame_from + ", frame_to:" + frame_to);

  let idx = 0;

  for (let i = 0; i < acf.length; i++) {
    if ((acf[i + 1] - acf[i]) > 0) {
      idx = i;
      break;
    }
  }

  console.log("break idx = " + idx);

  const adjAcf = [];
  Object.assign(adjAcf, acf);
  for (let i = 0; i <= idx; i++) {
    adjAcf[i] = -acf[0];
  }

  // console.log(adjAcf);
  const adjIdx = adjAcf.indexOf(Math.max(...adjAcf));
  let basaFrame = (4000 / adjIdx).toFixed(0);

  res.json(basaFrame);
});

router.get('/getAcfData', async function (req, res, next) {
  const file = req.query.file;
  console.log('file:' + file);
  const soundfile = "./sounds/" + file;
  let pcmdata = await decodeSoundFile(soundfile);
  const frame = 128;
  let going = true;
  let count = 0;
  let flag = false;
  let mark = [];
  let accfArr = [];

  while (going) {

    const frame_from = count * frame / 2;
    const frame_to = (count * frame / 2) + frame;
    const acf = ACF(pcmdata.slice(frame_from, frame_to));

    let idx = 0;

    for (let i = 0; i < acf.length; i++) {
      if ((acf[i + 1] - acf[i]) > 0) {
        idx = i;
        break;
      }
    }

    const adjAcf = [];
    Object.assign(adjAcf, acf);
    for (let i = 0; i <= idx; i++) {
      adjAcf[i] = -acf[0];
    }

    const adjIdx = adjAcf.indexOf(Math.max(...adjAcf));

    let basaFrame = (4000 / adjIdx).toFixed(0);
    // console.log("第" + count + "個  frame_from:" + frame_from + ", frame_to:" + frame_to + ", adjIdx=" + adjIdx + ", basaFrame = " + basaFrame);
    if (basaFrame >= 400) {
      mark.push(count);
      if (mark.length > 16 && !flag) {
        flag = !flag;
        accfArr.push({
          "start": count
        });
      }
    } else {
      mark = [];
      flag = !flag;
      // console.log("reset mark:" + mark.length === 0);

      if (accfArr.length >= 1) {
        accfArr[accfArr.length - 1]["end"] = count;
      }
    }

    count += 1;
    if (frame_to >= pcmdata.length) {
      going = false;
    }
  }

  res.json(accfArr);
});


module.exports = router;
