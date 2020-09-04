<template>
  <div class="chartBox">
    <div class="chartBox" v-show="!isError" ref="radarChart"></div>
    <div class="chartBox" v-show="isError">图表数据有误请核对</div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'radarChart',
    props:["chartData"],
    data(){
      return{
        isError:false
      }
    },
    mounted() {
      // this.initChart();
    },
    methods:{
      initChart(){
        var indicatorData = [];
        var chartData = [];
        var max = -5;
        console.log('abbbba')
        this.chartData.forEach((e,eind)=>{
          indicatorData.push({name: (e.medalDimensionName || eind)})
          chartData.push(e.scoreNum<-5?-5:e.scoreNum)
          // e.scoreNum = e.scoreNum<-5?-5:e.scoreNum;
          max = e.scoreNum>max?e.scoreNum:max;
        })
        console.log(max,33)
        indicatorData.map(e=>{e.max=max,e.min=-5});
        let radarChart = echarts.init(this.$refs.radarChart);
        var option = {
            color: ['#ed9710'],
            title: {
                text: '雷达图',
                top: 20,
                left: 41,
                textStyle:{
                  color: '#4c5058'
                }
            },
            tooltip: {},
            legend: {
                show: false
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#4c5058',
                        fontSize: 19,
                        fontWeight: 'bold',
                    }
                },
                indicator: indicatorData,
                splitArea: {
                  areaStyle: {
                    color: ['#fff','#eee']
                  }
                },
                silent: true,
            },
            series: [{
                type: 'radar',
                areaStyle: {opacity:0.1},
                data: [
                    {
                        name: '雷达图',
                        value: chartData,
                    }
                ],
                tooltip: {
                  show: false
                }
            }]
        };
        console.log(JSON.stringify(option),"opt222ion")
        radarChart.setOption(option);
      }
    },
    watch:{
      chartData(val){
        if(val.length==0){
          this.isError = true;
          return false;
        }
        this.initChart()
      }
    }
  }
</script>

<style scoped lang="scss">
  .chartBox{
    height: 100%;
    width: 100%;
  }
</style>
