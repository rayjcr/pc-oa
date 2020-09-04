<template>
  <div>
    <div id="myChart" ref="myChart" :style="mainstyle"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons');
  export default {
    data () {
      return {
        pieChart: null,
        mainstyle: {
          width: '700px',
          height: '380px',
          margin: 'auto'
        },
        ssssss: {
          map: 80,
          lines: 90,
          bar: 60,
          pie: 50,
        },
        all: 100,
      }
    },
    beforeDestroy(){
      if (!this.datas) {
        return
      }
      this.pieChart.dispose()
      this.pieChart = null
    },
    props: {
      datas:Object
    },
    created () {
      setTimeout(() => {
        this.initchart()
      }, 1000)
    },
    methods: {
     
      // 初始化echars表格
      initchart(){
        var status = []
        var name = []
        if (this.datas) {
          name = this.datas.name?this.datas.name:[]
          status = this.datas.value?this.datas.value:[]
        } else {
          name = []
          status = []
        }
        
// var waterMarkText = 'ECHARTS';

// var canvas = document.createElement('canvas');
// var ctx = canvas.getContext('2d');
// canvas.width = canvas.height = 100;
// ctx.textAlign = 'center';
// ctx.textBaseline = 'middle';
// ctx.globalAlpha = 0.08;
// ctx.font = '20px Microsoft Yahei';
// ctx.translate(50, 50);
// ctx.rotate(-Math.PI / 4);
// ctx.fillText(waterMarkText, 0, 0);
        this.pieChart= echarts.init(this.$refs.myChart)
        // console.log(this.pieChart)
        this.pieChart.setOption({
          tooltip: {},
          title: [{
              text: '',
              subtext: '总计 ' + this.all,
              x: '25%',
              textAlign: 'center'
          }],
          grid: [{
              top: 50,
              width: '90%',
              bottom: '2%',
              left: 10,
              containLabel: true
          }],
          xAxis: [{
              type: 'value',
              max: this.all,
              splitLine: {
                  show: false
              }
          }],
          yAxis: [{
            type: 'category',
            data: name, // 名字
            // axisLabel: {
            //   interval: 0,
            //   rotate: 30
            // },
            splitLine: {
              show: false
            }
          }],
          series: [{
            type: 'bar',
            stack: 'chart',
            z: 3,
            label: {
              normal: {
                position: 'right',
                show: true
              }
            },
            data: status, // 数据
          }]
          // , {
          //   type: 'bar',
          //   stack: 'chart',
          //   silent: true,
          //   itemStyle: {
          //     normal: {
          //       color: '#eee'
          //     }
          //   },
          //   data: Object.keys(builderJson.charts).map(function (key) {
          //       return builderJson.all - builderJson.charts[key];
          //   })
          // }
        }, true, true)
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>