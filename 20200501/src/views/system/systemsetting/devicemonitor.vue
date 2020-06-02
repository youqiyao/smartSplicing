<style lang="less" src='./styles/devicemonitor.less'></style>
<template>
    <div class="devicemonitor">
        <el-row :gutter="16" style="height: 100%;">
            <el-col :span="12" style="height: 100%;">
            <div class="maintitle">
                <p>{{$t('盒子')}}</p>
            </div>
            <div class="devicetabs">
             <el-tabs v-model="activeName1" type="card" @tab-click="boxHandleClick">
                <el-tab-pane :label="$t('网络带宽占用比')" name="wifiratio">
                   <div class="containerechart" ref="wifiratio"></div> 
                </el-tab-pane>
                <el-tab-pane :label="$t('解码带宽使用比')" name="decoderatio">
                    <div class="containerechart" ref="decoderatio"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('开窗数')" name="wincount">
                    <div class="containerechart" ref="wincount"></div>
                </el-tab-pane>
             </el-tabs>
            </div>
        </el-col>
        <el-col :span="12" style="height: 100%;">
            <div class="maintitle">
                <p>{{$t('流媒体服务器')}}</p>
            </div>
            <div class="devicetabs">
              <el-tabs v-model="activeName2" type="card" @tab-click="boxHandleClick">
                <el-tab-pane :label="$t('CPU')" name="cpu">
                    <div class="containerechart" ref="cpu"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('内存')" name="ram">
                    <div class="containerechart" ref="RAM"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('网络')" name="wifi">
                    <div class="containerechart" ref="wifi"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('磁盘IO')" name="disk">
                    <div class="containerechart" ref="disk"></div>
                </el-tab-pane>
                <el-tab-pane :label="$t('流转发路数')" name="stream">
                    <div class="containerechart" ref="stream"></div>
                </el-tab-pane>
              </el-tabs>
            </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import data from './data'
    import echarts from 'echarts'
    export default {
        name: 'signalsource',
        components: {

        },
        data() {
            return {
               activeName1:'wifiratio',
               activeName2:'ram',
            
            }
        },
        computed: {
          
        },
        created: function() {
          this.$nextTick(function() {
               this.deviceMonitorEchart()
          })
        },
        watch: {
           
        },
        methods: {

            boxHandleClick(tab, event) {
                console.log(tab, event);
            },
            deviceMonitorEchart:function() {

                this.wifiratioEchart()
                this.initMediaCpuEchart()
                this.initMediaRAMEchart()
            },

            wifiratioEchart:function() {
              var wifiratioEchart = echarts.init(this.$refs['wifiratio'])
              var colors = ['#5793f3', '#d14a61', '#675bba']
              var wifiratiooption = {
                color: colors,
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data:['2015 降水量', '2016 降水量']
                },
                grid: {
                    top: 70,
                    bottom: 50
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '降水量  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
                    },
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '降水量  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name:'2015 降水量',
                        type:'line',
                        xAxisIndex: 1,
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                      name:'2016 降水量',
                      type:'line',
                      smooth: true,
                      data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                  }
                ]
              }
              wifiratioEchart.setOption(wifiratiooption)
            },

            initMediaCpuEchart: function() {
                function randomData() {
                    now = new Date(+now + oneDay);
                    value = value + Math.random() * 21 - 10;
                    return {
                        name: now.toString(),
                        value: [
                            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                            Math.round(value)
                        ]
                    }
                }

                var myChart = echarts.init(this.$refs['cpu'])
                var data = [];
                var now = +new Date(1997, 9, 3);
                var oneDay = 24 * 3600 * 1000;
                var value = Math.random() * 1000;
                for (var i = 0; i < 1000; i++) {
                    data.push(randomData());
                }

                var option = {
                    title: {
                        text: '动态数据 + 时间坐标轴'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            params = params[0];
                            var date = new Date(params.name);
                            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: data
                    }]
                };
                myChart.setOption(option)
                setInterval(function () {
                    for (var i = 0; i < 5; i++) {
                        data.shift();
                        data.push(randomData());
                    }

                    myChart.setOption({
                        series: [{
                            data: data
                        }]
                    });
                }, 1000);
            },
            
            initMediaRAMEchart: function() {
                var myChart = echarts.init(this.$refs['RAM'])
                myChart.hideLoading();
                var option = {}
                var base = -data.reduce(function (min, val) {
                    return Math.floor(Math.min(min, val.l));
                }, Infinity);
                myChart.setOption( option = {
                    title: {
                        text: 'Confidence Band',
                        subtext: 'Example in MetricsGraphics.js',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            animation: false,
                            label: {
                                backgroundColor: '#ccc',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                textStyle: {
                                    color: '#222'
                                }
                            }
                        },
                        formatter: function (params) {
                            return params[2].name + '<br />' + params[2].value;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: data.map(function (item) {
                            return item.date;
                        }),
                        axisLabel: {
                            formatter: function (value, idx) {
                                var date = new Date(value);
                                return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        boundaryGap: false
                    },
                    yAxis: {
                        axisLabel: {
                            formatter: function (val) {
                                return (val - base) * 100 + '%';
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return ((params.value - base) * 100).toFixed(1) + '%';
                                }
                            }
                        },
                        splitNumber: 3,
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: 'L',
                        type: 'line',
                        data: data.map(function (item) {
                            return item.l + base;
                        }),
                        lineStyle: {
                            normal: {
                                opacity: 0
                            }
                        },
                        stack: 'confidence-band',
                        symbol: 'none'
                    }, {
                        name: 'U',
                        type: 'line',
                        data: data.map(function (item) {
                            return item.u - item.l;
                        }),
                        lineStyle: {
                            normal: {
                                opacity: 0
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: '#ccc'
                            }
                        },
                        stack: 'confidence-band',
                        symbol: 'none'
                    }, {
                        type: 'line',
                        data: data.map(function (item) {
                            return item.value + base;
                        }),
                        hoverAnimation: false,
                        symbolSize: 6,
                        itemStyle: {
                            normal: {
                                color: '#c23531'
                            }
                        },
                        showSymbol: false
                    }]
                });              
            }
        }
    }
</script>