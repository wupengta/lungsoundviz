var canvas = document.getElementById("feature-chart");
var ctx = canvas.getContext("2d");
var startTime;
var isPlayFeature = false;

function draw() {

    if (!startTime) {
        startTime = performance.now();
    }
    var current = performance.now();
    var duration = (Plot.featurePlayEnd - Plot.featurePlayStart) * 1000;
    var deltaTime = (current - startTime) / duration;
    var currentX = (Plot.featurePlayStart + deltaTime * duration / 1000) * 22.2 + 54;

    if (deltaTime < 1) {
        animate(currentX);
        requestAnimationFrame(draw);
    } else {
        startTime = null;
    }
}

function animate(x) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const instance = echarts.getInstanceByDom(document.getElementById('feature-chart'));
    const insOpt = instance.getOption();
    instance.clear();
    instance.setOption(insOpt);

    ctx.beginPath();
    ctx.moveTo(x, 80);
    ctx.lineTo(x, 380);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

var Plot = {
    seriesIdx: -1,
    blockElm: {
        message: "<i class='fa fa-spinner fa-pulse white'style = 'font-size:600%'></i>",
        css: {
            color: '#fff',
            borderWidth: '0px',
            backgroundColor: 'transparent'
        },
    },
    featurePlayStart: 0,
    featurePlayEnd: 0,
    waveStart: 0,
    waveEnd: 30,
    featureSection: [],
    play: async function (feature_id, time, part, patient_id, date) {
        $.blockUI(Plot.blockElm);

        // audioName是這位病患當天上午或下午某個部位的錄音檔名，規則為00001_20190806_pm_F1.wav，
        // 因為音檔不夠多所以此雛形系統都命名為demo，日後應該要到一個file server中去fetch真實音檔，帶入到以下程式中。
        // let zero_patient_id = patient_id.padStart(5, "0");
        // let audioName = `${zero_patient_id}_${date}_${time}_${part}.wav`;
        // $('#audioName').val(audioName);
        // let audioBuffer = await Plot.readAudioFile(audioName);

        $('#audioName').val('demo.wav');
        let audioBuffer = await Plot.readAudioFile('demo.wav');

        let pcmdata = Array.prototype.slice.call(audioBuffer.getChannelData(0));
        let chart = echarts.init(document.getElementById('feature-chart'), {
            renderer: 'canvas'
        });

        Plot.featureSection = await $.getJSON(`/getFeatureSection?feature_id=${feature_id}`);
        let data = Plot.featureSection.map(section => {
            return {
                value: [
                    0,
                    section.start,
                    section.end,
                ],
                itemStyle: {
                    normal: {
                        color: "blue"
                    }
                }
            }
        });

        function renderItem(params, api) {

            var categoryIndex = api.value(0);
            var start = api.coord([api.value(1), categoryIndex]);
            var end = api.coord([api.value(2), categoryIndex]);
            var height = api.size([0, 1])[1] * 0.6;

            var rectShape = echarts.graphic.clipRectByRect({
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
            }, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            });

            return rectShape && {
                type: 'rect',
                shape: rectShape,
                style: api.style()
            };
        }

        let option = {
            title: {
                text: '',
                left: 'center'
            },
            animation: false,
            grid: {
                left: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                min: 0,
                axisLabel: {
                    formatter: function (val) {
                        return Math.max(0, val) + ' s';
                    },
                    clickable: true,
                }
            },
            yAxis: {
                data: ['Wheese'],
                show: false,
            },
            series: [{
                type: 'custom',
                renderItem: renderItem,
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: data,

            }]
        };
        chart.setOption(option);

        chart.on('click', function (params) {
            Plot.seriesIdx = params.dataIndex;
            Plot.featurePlayStart = params.value[1];
            Plot.featurePlayEnd = params.value[2];

            let audioName = $('#audioName').val();
            Plot.featurePlayStart = parseFloat(Plot.featurePlayStart) - parseFloat($('#forward-input').val());
            Plot.featurePlayStart = Plot.featurePlayStart < 0 ? 0 : Plot.featurePlayStart;

            Plot.featureAudio = document.createElement('AUDIO');
            // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
            Plot.featureAudio.src = '/sounds/' + audioName + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd;

            const instance = echarts.getInstanceByDom(document.getElementById('feature-chart'));
            const insOpt = instance.getOption();

            insOpt.series[0].data.forEach((d, i) => {
                if (i === params.dataIndex) {
                    if (insOpt.series[0].data[i].itemStyle.color === 'black') {
                        insOpt.series[0].data[i].itemStyle.color = 'blue';
                        Plot.seriesIdx = -1;
                    } else {
                        insOpt.series[0].data[i].itemStyle.color = 'black';
                    }
                } else {
                    insOpt.series[0].data[i].itemStyle.color = 'blue';
                }
            });

            instance.clear();
            instance.setOption(insOpt);
        });

        // ========================================= 波形圖 ========================================= 

        const waveform_chart = echarts.init(document.getElementById('waveform-chart'));
        const waveform_option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: pcmdata.map((d, i) => {
                    return (i / 4000).toFixed(2) + 's';
                })
            },
            dataZoom: [{
                type: 'inside',
            }, {
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            series: [{
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                data: pcmdata
            }]
        };
        waveform_chart.setOption(waveform_option);

        waveform_chart.on('datazoom', function (params) {

            Plot.waveStart = params.start * 30 / 100;
            Plot.waveEnd = (params.end * 30 / 100) === 0 ? 30 : (params.end * 30 / 100);

        });

        $.unblockUI();

        let tabName = '喘鳴音';
        if ($('#select-feature').val() === 'finecrackle') {
            tabName = '細爆裂音';
        } else if ($('#select-feature').val() === 'coarsecrackle') {
            tabName = '粗囉音';
        } else if ($('#select-feature').val() === 'rhonchi') {
            tabName = '乾囉音';
        }

        $('#pills-feature-tab').html(tabName);

        $('#exampleModal').modal('show');
    },
    readAudioFile: function (audoiFile) {
        const context = new AudioContext({
            sampleRate: 4000
        });
        return new Promise(function (resolve, reject) {
            // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
            window.fetch('/sounds/' + audoiFile)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    // console.log("sample rate:" + audioBuffer.sampleRate);
                    // console.log("duration:" + audioBuffer.duration);
                    // const pcmdata = audioBuffer.getChannelData(0);
                    // const duration = audioBuffer.duration;
                    resolve(audioBuffer);
                });
        });
    },
    // ========================================= 選擇上/下一個 ========================================= 
    selectIdx: function (args) {

        let instance = echarts.getInstanceByDom(document.getElementById('feature-chart'));
        let insOpt = instance.getOption();
        let insOptData = insOpt.series[0].data;

        if (args == 'backward') {
            if (Plot.seriesIdx > 0) {
                Plot.seriesIdx -= 1;
            }
        } else if (args == 'forward') {
            if (Plot.seriesIdx < insOpt.series[0].data.length - 1) {
                Plot.seriesIdx += 1;
            }
        } else {
            // Plot.seriesIdx = -1;
        }
        // console.log(Plot.seriesIdx);
        Plot.featurePlayStart = insOptData[Plot.seriesIdx].value[1];
        Plot.featurePlayEnd = insOptData[Plot.seriesIdx].value[2];
        // console.log(Plot.featurePlayStart, Plot.featurePlayEnd);
        Plot.featurePlayStart = parseFloat(Plot.featurePlayStart) - parseFloat($('#forward-input').val());
        Plot.featurePlayStart = Plot.featurePlayStart < 0 ? 0 : Plot.featurePlayStart;
        // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
        Plot.featureAudio = new Audio('/sounds/' + $('#audioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);

        insOpt.series[0].data.forEach((d, i) => {
            if (i === Plot.seriesIdx) {
                insOpt.series[0].data[i].itemStyle.color = 'black';

            } else {
                insOpt.series[0].data[i].itemStyle.color = 'blue';
            }
        });

        instance.clear();
        instance.setOption(insOpt);
    },
    ended: function () {
        console.log("ended");
    },
    setforward: function (elm) {

        Plot.featurePlayStart = parseFloat(Plot.featurePlayStart) - parseFloat($('#forward-input').val());
        let start = Plot.featurePlayStart < 0 ? 0 : Plot.featurePlayStart;
        // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
        Plot.featureAudio = new Audio('/sounds/' + $('#audioName').val() + '#t=' + start + ',' + Plot.featurePlayEnd);

    },
    featureAudio: {},
    playSelectedFeature: function () {
        console.log("isPlayFeature:" + isPlayFeature);

        Plot.featureAudio.play();
        // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
        Plot.featureAudio = new Audio('/sounds/' + $('#audioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);
        draw();

    },
    pauseSelectedFeature: function () {
        Plot.featureAudio.pause();
        // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
        Plot.featureAudio = new Audio('/sounds/' + $('#audioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);
    },
    playall: function () {
        let audio = document.getElementById("feature-audio");
        Plot.featurePlayStart = 0;
        Plot.featurePlayEnd = 30;
        audio.play();
        draw();
    },
    pauseall: function () {
        let audio = document.getElementById("feature-audio");
        audio.pause();
    },
    waveAudio: {},
    playwave: function () {

        let audioName = $('#audioName').val();
        let from = parseFloat(Plot.waveStart);
        let end = parseFloat(Plot.waveEnd);
        console.log(Plot.waveStart, Plot.waveEnd);
        // 此為雛型系統故音檔放在專案中的某個資料夾，日後應該要有一個file server存放音檔，window.fetch中帶入音檔的url位置
        Plot.waveAudio = new Audio('/sounds/' + audioName + '#t=' + from + ',' + end);
        Plot.waveAudio.play();
    },
    pausewave: function () {
        Plot.waveAudio.pause();
    }

}
