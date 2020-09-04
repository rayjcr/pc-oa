<template>
  <div class="chartBox" ref="lineChart"></div>
</template>

<script>
  import echarts from 'echarts'
  export default{
    name: 'lineChart',
    props: ["chartData"],
    mounted() {
      this.initChart(this.chartData);
    },
    methods:{
      initChart(chartData){        
        let lineChart = echarts.init(this.$refs.lineChart);
        
        let axisData = [];
        let sgList = [];
        let tzList = [];
        chartData.forEach(e=>{
          axisData.push(e.xq);
          sgList.push(e.sg);
          tzList.push(e.tz);
        })
        console.log(chartData,25)
        
        var option = {
          color: ['#ed9710','#206bef'],
          tooltip: {
              trigger: 'axis'
          },    
          legend: [{
            data: ['身高(cm)'],
            icon: 'circle',
            left: 30,
            top: 40,
            textStyle: {
              color: '#4c5058',
              fontWeight: 'bold',
              fontSize: 19
            }
          },{
            data: ['体重(kg)'],
            icon: 'circle',
            right: 30,
            top: 40,
            textStyle: {
              color: '#4c5058',
              fontWeight: 'bold',
              fontSize: 19
            }
          }],
          grid: {
              left: 80,
              right: 80,
              bottom: '3%',
              top: 80,
              containLabel: true
          },
          xAxis: {
              type: 'category',
              axisTick: {
                  show: false
              },
              axisLine: {
                lineStyle:{
                  color: '#01082c',
                } 
              },
              axisLabel:{
                textStyle:{
                  color: '#4c5058',
                  fontSize: 15,                      
                }
              },
              data: axisData
          },
          yAxis: [
              {
                  name: '',
                  type: 'value',
                  axisTick: {
                      show: false
                  },
                  splitLine: {
                      show: false  
                  },
                  axisLine: {
                    lineStyle:{
                      color: '#01082c',
                    }                    
                  },
                  max: 200,
                  axisLabel:{
                    textStyle:{
                      color: '#4c5058',
                      fontSize: 19,                      
                    }
                  }
              },
              {
                  name: '',
                  // nameLocation: 'start',
                  type: 'value',
                  axisTick: {
                      show: false
                  },
                  splitLine: {
                      show: false  
                  },
                  axisLine: {
                    lineStyle:{
                      color: '#01082c',
                    }  
                  },
                  max: 80,
                  axisLabel:{
                    textStyle:{
                      color: '#4c5058',
                      fontSize: 19,                      
                    }
                  }
                  // inverse: true
              }
          ],
          series: [
              {
                  name: '身高(cm)',
                  type: 'line',
                  data: sgList,
                  symbol: 'circle',
                  symbolSize: 13,
                  itemStyle: {
                      borderWidth: 3,
                      borderColor: '#ed9710',
                      color: '#ffdc93'
                  },
                  lineStyle: {
                      color: '#ed9710'
                  }
              },
              {
                  name: '体重(kg)',
                  yAxisIndex: 1,
                  type: 'line',
                  data: tzList,
                  symbol: 'circle',
                  symbolSize: 13,
                  itemStyle: {
                      borderWidth: 3,
                      borderColor: '#206bef',
                      color: '#b8d2ff'
                  },
                  lineStyle: {
                      color: '#206bef'
                  }
              }
          ]
        };
        lineChart.setOption(option);
      }
    },
    watch:{
      chartData(val){
        if(val){
          this.initChart(val)
        }
        // if(val.length==0){
        //   this.isError = true;
        //   return false;
        // }
        
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
