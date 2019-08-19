var Chart = {
    features: [],
    INIT_AMCHART: function () {

        const date = $('#datepicker').val();
        const xAxis = [];
        for (let i = 0; i <= 6; i++) {
            xAxis.push(moment(date, 'YYYY/MM/DD').subtract(i, 'days').format('MM/DD'));
        }
        const xAxis_reversed = xAxis.reverse();

        const amChart = echarts.init(document.getElementById('amChart'));
        let series = [];

        $('.bgc').each((index, elem) => {
            series.push({
                name: $(elem).attr('id'),
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0],
                color: $(elem).data('color')
            });
        });

        let option = {
            title: {
                text: '一週喘鳴音變化圖(上午)'
            },
            animation: false,
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis_reversed
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };

        amChart.setOption(option);

    },
    //一週喘鳴音比例
    drawAmChart: async function () {

        const xAxis = [];
        for (let i = 0; i <= 6; i++) {
            xAxis.push(moment($("#datepicker").val(), 'YYYY/MM/DD').subtract(i, 'days').format('MM/DD'));
        }
        const xAxis_reversed = xAxis.reverse();
        const instance = echarts.getInstanceByDom(document.getElementById('amChart'));
        let series = [];
        $('.bgc').each((index, elem) => {

            const data = Chart.features.filter(item => {
                return item.part === $(elem).data('part') && item.time === 'am';
            });

            const percentage = data.map(d => d.percentage);

            series.push({
                name: $(elem).attr('id'),
                type: 'line',
                data: percentage,
                color: $(elem).data('color')
            });
        });

        const insOption = instance.getOption();
        insOption.series = series;
        insOption.xAxis[0].data = xAxis_reversed;

        let chartTitle = '一週喘鳴音變化圖(上午)';
        if ($('#select-feature').val() === 'crackle') {
            chartTitle = '一週粗囉音變化圖(上午)';
        } else if ($('#select-feature').val() === 'rhonchi') {
            chartTitle = '一週乾囉音變化圖(上午)';
        }
        insOption.title[0].text = chartTitle;

        instance.clear();
        instance.setOption(insOption);
    },
    INIT_PMCHART: function () {

        const date = $('#datepicker').val();
        const xAxis = [];
        for (let i = 0; i <= 6; i++) {
            xAxis.push(moment(date, 'YYYY/MM/DD').subtract(i, 'days').format('MM/DD'));
        }
        const xAxis_reversed = xAxis.reverse();

        const pmChart = echarts.init(document.getElementById('pmChart'));
        let series = [];

        $('.bgc').each((index, elem) => {
            series.push({
                name: $(elem).attr('id'),
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0],
                color: $(elem).data('color')
            });
        });

        let option = {
            title: {
                text: '一週喘鳴音變化圖(上午)'
            },
            animation: false,
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis_reversed
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };

        pmChart.setOption(option);

    },
    //一週喘鳴音比例
    drawPmChart: async function () {

        const xAxis = [];
        for (let i = 0; i <= 6; i++) {
            xAxis.push(moment($("#datepicker").val(), 'YYYY/MM/DD').subtract(i, 'days').format('MM/DD'));
        }
        const xAxis_reversed = xAxis.reverse();
        const instance = echarts.getInstanceByDom(document.getElementById('pmChart'));
        let series = [];
        $('.bgc').each((index, elem) => {

            const data = Chart.features.filter(item => {
                return item.part === $(elem).data('part') && item.time === 'pm';
            });

            const percentage = data.map(d => d.percentage);

            series.push({
                name: $(elem).attr('id'),
                type: 'line',
                data: percentage,
                color: $(elem).data('color')
            });
        });

        const insOption = instance.getOption();
        insOption.series = series;
        insOption.xAxis[0].data = xAxis_reversed;

        let chartTitle = '一週喘鳴音變化圖(下午)';
        if ($('#select-feature').val() === 'crackle') {
            chartTitle = '一週粗囉音變化圖(下午)';
        } else if ($('#select-feature').val() === 'rhonchi') {
            chartTitle = '一週乾囉音變化圖(下午)';
        }
        insOption.title[0].text = chartTitle;
        instance.clear();
        instance.setOption(insOption);
    },
    drawPartChart: async function () {

        // console.log(Chart.features);

        let singleDay = _.groupBy(Chart.features.filter(feature => {
            return feature.patient_id + '' === $("#hPatientId").val() && moment(feature.upload_date).format('YYYY/MM/DD') === $("#datepicker").val();
        }), 'part');

        Object.keys(singleDay).forEach(part => {
            const part_chart = echarts.init(document.getElementById(part));
            const part_option = {
                xAxis: {
                    scale: true,
                    data: ["am", "pm"]
                },
                yAxis: {
                    show: false,
                    min: 0,
                    max: 100
                },
                grid: {
                    x: 10, //默認是80px
                    y: 0, //默認是60px
                    x2: 10, //默認80px
                    y2: 25 //默認60px
                },
                series: [{
                    type: 'bar',
                    data: [singleDay[part][0].percentage, singleDay[part][1].percentage],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                return params.value + '%'
                            },
                        },
                    },
                    barWidth: 15,
                }],
            };
            part_chart.setOption(part_option);
            // console.log(singleDay[part]);
            let date = $('#datepicker').val().replace(/\\|\//g, '');
            $('#' + part).append(
                '<div class="list show">' +
                '<button onclick=Plot.play(\'' + singleDay[part][0].feature_id + '\',\'am\',\'' + singleDay[part][0].part + '\',\'' + singleDay[part][0].patient_id + '\',\'' + date + '\') class="btn btn-light btn-sm">早上&nbsp;<i class="far fa-play-circle"></i></button>' +
                '<button onclick=Plot.play(\'' + singleDay[part][1].feature_id + '\',\'pm\',\'' + singleDay[part][1].part + '\',\'' + singleDay[part][1].patient_id + '\',\'' + date + '\') class="btn btn-light btn-sm">下午&nbsp;<i class="far fa-play-circle"></i></button>' +
                '</div>'
            );
        });

    },
    goTo: function (date) {

        $("#datepicker").val(date);
        Chart.updateFeatures($("#hPatientId").val(), date, $('#select-feature').val());

    },
    updateFeatures: function (patient_id, date, feature) {

        // console.log("updateFeatures : " + patient_id + ", " + date + "," + feature);

        $.ajax({
            type: "GET",
            url: "/getFeatures",
            data: {
                patient_id: patient_id,
                date: date,
                feature: feature
            },
            success: function (res) {
                // console.log(res);
                Chart.features = res;

                Chart.drawPartChart();
                Chart.drawAmChart();
                Chart.drawPmChart();

            }
        });

    }

}
