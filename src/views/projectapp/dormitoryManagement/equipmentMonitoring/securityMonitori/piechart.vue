<template>
      <div class="chartBox" v-loading = "chartBoxLoading">
            <div :ref="className" :style="{height:height,width:width}"></div>
            <div class="value"><span :style="{color:now.color}">{{now.value}}</span>{{now.name}}</div>            
      </div>

</template>
<script>
import echarts from 'echarts';
import { debounce } from 'utils';
import { deviceGetDetail,deviceGetCount } from '@/api/projectapp/dormitoryManagement/abnormalMonitoring';

export default {
  name: 'pieChart',
  props: {
    className: {//类型名称
      type: String,
      default: 'chart'
    },
    width: {//宽度
      type: String,
      default: '100%'
    },
    height: {//高度
      type: String,
      default: '200px'
    },
    buildingId: {//建筑id
      type: Number,
      default: 0       
    }
  },
  data() {
    return {
        chart: null,//图对象
        chartdata:[//图中要显示的信息
            {value:90, name:'低电量',color:'#facc14',itemStyle:{normal:{color:'#facc14'},emphasis:{color:'#facc14'}}},              
            {value:160, name:'正常',color:'#2fc25b',itemStyle:{normal:{color:'#2fc25b'},emphasis:{color:'#2fc25b'}}},
            {value:10, name:'离线',color:'#d1d4da',itemStyle:{normal:{color:'#d1d4da'},emphasis:{color:'#d1d4da'}}},
            {value:90, name:'未安装',color:'#eceff4',itemStyle:{normal:{color:'#eceff4'},emphasis:{color:'#eceff4'}}},              
        ],
        now: {},
        chartBoxLoading: false,//图表加载状态
    }
  },
  methods: {
      init(){
        var that = this;
        this.chart = echarts.init(this.$refs.chart, 'macarons');
        var data = this.chartdata;
        this.now = this.chartdata[1];
        this.chart.setOption({
            legend: {
                  orient: 'vertical',
                  x: 'left',
                  data:data,
                  formatter: function(name){
                        for (var i = 0, l = data.length; i < l; i++) {
                              if (data[i].name == name) {
                                    return name + ':' + data[i].value;
                              }
                        }
                  },
                  selectedMode:false,
                  textStyle: {
                        color: '#303133',
                        fontFamily: 'PingFang-SC-Bold',
                        fontSize: 14,
                        lineHeight: 24,
                  },
                  itemGap:20,
                  padding: 0,
                  icon: 'none',
                  top: 26,
            },
            series: [
                  {
                        name:'访问来源',
                        type:'pie',
                        radius: [60, 70],
                        color: ['#2fc25b','#facc14','#d1d4da','#eceff4'],
                        avoidLabelOverlap: false,
                        center:[292,90],
                        label: {
                        normal: {
                              show: false,
                              position: 'center'
                        },
                        emphasis: {
                              show: false,
                              formatter: "{number|{c}}\n{text|{b}}",
                              rich: {
                                    number:{
                                          fontSize: 30,
                                    },
                                    text:{
                                          color: '#303133',
                                          fontSize: 12
                                    }
                              },    
                        },
                        },
                        labelLine: {
                              normal: {
                                    show: false
                              }
                        },
                        data:data
                  }]
        })
        this.chart.on('mousemove',function (params) {
          that.now.value = params.data.value;
          that.now.name = params.data.name;
          that.now.color = params.data.color;
        });

      },  //
      getData(){//获取图中要显示的信息
         this.chartBoxLoading = true;
         return deviceGetCount({buildingId:this.buildingId}).then((res)=>{
               return new Promise((reolve,reject)=>{
                  if (res.resultCode === 1) {
                        console.log(res.value)
                        var data = res.value;
                        var normal=0,lowPower=0,offLine=0,notInstalled=0;
                        for(var item in data){//循环获取的楼层信息  数据格式为 楼层编号[低电量,在线,未安装,正常,所有房间]
                              normal += data[item][3];
                              lowPower += data[item][0];
                              notInstalled += data[item][2];
                              offLine += (data[item][4]-data[item][1]-data[item][2]);//离线 = 所有-未安装-在线
                        }
                        this.chartdata[0].value = lowPower;
                        this.chartdata[1].value = normal;
                        this.chartdata[2].value = offLine;
                        this.chartdata[3].value = notInstalled;
                        this.chartBoxLoading = false;
                        console.log(this.chartdata,140)
                        reolve();
                  } else {
                  this.$message({
                        type: 'error',
                        message: res.resultMessage
                  });
                  this.chartBoxLoading = false;
                  reject();
                  }                     
               })
            })
      }
  },
  mounted() {
       this.getData().then((res)=>{//获取数据后画图
            this.init()             
       })

  }
}
</script>
<style scoped>
.chartBox{
      position: relative;
}
.value{
      height: 50px;
      width: 50px;
      position: absolute;
      right: 200px;
      top: 68px;
      text-align: center;
      color: #303133;
      font-size: 12px;
}
.value span{
      display: block;
      font-size: 30px;
      line-height: 30px;
}
</style>
