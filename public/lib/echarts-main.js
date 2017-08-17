// JavaScript Document
//PCU曲线图
var roomPuc = echarts.init(document.getElementById('roomPuc'));
var num = [];
var suiji = [];
for (var i = 1; i < 31; i++) {
    num.push(i);
    suiji.push(Math.floor(Math.random() * 10000));
}

roomPuc.setOption({
    title: {},
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['在线人数(开发中)'],

    },
    toolbox: {
        show: true,
        feature: {
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: false,

    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: num,	//月份
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '在线人数',
            type: 'line',
            backgroundColor: 'rgba(177, 94, 189,.7)',
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: {color: '#ADA0EB', width: '0'},
                    areaStyle: {type: 'default', color: 'rgba(173, 160, 235,.5)'}
                }
            },
            symbol: 'emptyDiamond',
            data: suiji
        }
    ],
});
