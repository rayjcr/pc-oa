<template>
  <div id="myChart" ref="myChart" :style="mainstyle"></div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons');
  export default {
    data () {
      return {
        pieChart: null,
        mainstyle: {
          width: '450px',
          height: '380px',
          margin: 'auto'
        }
      }
    },
    props: {
      h: Number,
      w: Number,
      dataN: Array,
      dataV: Array,
      danwei: String
    },
    mounted() {
      this.mainstyle.width =  this.w + 'px'
      this.mainstyle.height =  this.h + 'px'
      setTimeout(() => {
        this.initchart(this.dataN,this.dataV)
      }, 500)
    },
    beforeDestroy(){
      if (!this.dataV) {
        return
      }
      this.pieChart.dispose()
      this.pieChart = null
    },
    methods: {
      initchart(dataN,dataV) {
        this.pieChart= echarts.init(this.$refs.myChart)
        var indicators = []
        indicators = dataN
        var datas = []
        // console.log('我是dataV')
        // console.log(dataV)
        datas = dataV[0].value
        this.pieChart.setOption({
          title: {
            text: '学习表现' + '(' + this.danwei + ')'
          },
          tooltip: {},
          legend: {
          },
          radar: {
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: indicators
          },
          series: [{
            name: '',
            type: 'radar',
            data: [
              {
                value: datas,
                name:''
              }
            ]
          }]
        }, true, true)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>