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
    play: async function (part, time) {
        $.blockUI(Plot.blockElm);

        // let date = $('#datepicker').val().replace(/\\|\//g, '');
        // let zeroPatientId = '0000' + $("#hPatientId").val();
        // console.log(zeroPatientId + '_' + date + '_' + time + '_' + part + '.wav');
        $('#iAudioName').val('demo.wav');
        // $('#feature-audio').attr('src', '/sounds/' + zeroPatientId + '_' + date + '_' + time + '_' + part + '.wav');
        $('#feature-audio').attr('src', '/sounds/demo.wav');
        $('#fullAudio').attr('src', '/sounds/demo.wav');
        // let audioBuffer = await Plot.readAudioFile(zeroPatientId + '_' + date + '_' + time + '_' + part + '.wav');
        let audioBuffer = await Plot.readAudioFile('demo.wav');
        // console.log(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate, audioBuffer.duration);
        let pcmdata = Array.prototype.slice.call(audioBuffer.getChannelData(0));
        // console.log(pcmdata);
        let chart = echarts.init(document.getElementById('feature-chart'), {
            renderer: 'canvas'
        });
        let acfData = ACF.genarator1(pcmdata);
        // let acfData = await $.getJSON('/getAcfData?file=' + zeroPatientId + '_' + date + '_' + time + '_' + part + '.wav');

        if (acfData.length === 0) {
            acfData = ACF.genarator1(pcmdata);
        }

        let data = acfData.map((acf, i) => {

            let end = (acf.end - acf.start) / 2;
            // end = end < 250 ? 250 : end;
            // if (end - acf.start < 16) {
            //     end = acf.start + 16;
            // }

            return {
                value: [
                    0,
                    acf.start * 16 / 1000,
                    (acf.start + end) * 16 / 1000,
                ],
                itemStyle: {
                    normal: {
                        color: "blue"
                    }
                }
            }
        });

        Plot.featureSection = data.map(d => d.value.slice(1, 3));
        console.log(JSON.stringify(Plot.featureSection));
        // Plot.featureAudio = new Audio('/sounds/' + $('#iAudioName').val() + '#t=' + Plot.featureSection[0][0] + ',' + Plot.featureSection[0][1]);

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
            // console.log(params.value);
            Plot.featurePlayStart = params.value[1];
            Plot.featurePlayEnd = params.value[2];

            let audioName = $('#iAudioName').val();
            Plot.featurePlayStart = parseFloat(Plot.featurePlayStart) - parseFloat($('#forward-input').val());
            Plot.featurePlayStart = Plot.featurePlayStart < 0 ? 0 : Plot.featurePlayStart;

            Plot.featureAudio = document.createElement('AUDIO');
            Plot.featureAudio.src = '/sounds/' + audioName + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd;
            // Plot.featureAudio.addEventListener('timeupdate', function (e) {
            //     curtime = parseInt(song.currentTime, 10);
            //     $("#seek").attr("value", curtime);
            // });
            // Plot.featureAudio.addEventListener('ended', function (e) {
            //     console.log(e);
            // });
            // audio.play();

            // Plot.featureAudio = document.getElementById("fAudio");
            // Plot.featureAudio.src = '/sounds/' + audioName + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd
            // Plot.featureAudio = new Audio('/sounds/' + audioName + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);

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
            console.log(params.start * 30 / 100);
            console.log(params.end * 30 / 100);

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
        Plot.featureAudio = new Audio('/sounds/' + $('#iAudioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);

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
        Plot.featureAudio = new Audio('/sounds/' + $('#iAudioName').val() + '#t=' + start + ',' + Plot.featurePlayEnd);

    },
    featureAudio: {},
    playSelectedFeature: function () {
        console.log("isPlayFeature:" + isPlayFeature);

        Plot.featureAudio.play();
        // $(Plot.featureAudio).on('end', function () {
        //     console.log("ended");
        // });
        Plot.featureAudio = new Audio('/sounds/' + $('#iAudioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);

        // if (Plot.featureAudio.currentTime > duration) {
        //     Plot.featureAudio = new Audio('/sounds/' + $('#iAudioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);
        //     console.log("finish");
        //     // Plot.featureAudio.pause();
        //     isPlayFeature = false;

        //     console.log("set isPlayFeature to " + isPlayFeature);
        // }
        draw();

    },
    pauseSelectedFeature: function () {
        // console.log(Plot.featureAudio.currentTime);
        // console.log(Plot.featureAudio.duration);
        Plot.featureAudio.pause();
        Plot.featureAudio = new Audio('/sounds/' + $('#iAudioName').val() + '#t=' + Plot.featurePlayStart + ',' + Plot.featurePlayEnd);
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

        let audioName = $('#iAudioName').val();
        let from = parseFloat(Plot.waveStart);
        let end = parseFloat(Plot.waveEnd);
        console.log(Plot.waveStart, Plot.waveEnd);
        Plot.waveAudio = new Audio('/sounds/' + audioName + '#t=' + from + ',' + end);
        Plot.waveAudio.play();
    },
    pausewave: function () {
        Plot.waveAudio.pause();
    }

}
