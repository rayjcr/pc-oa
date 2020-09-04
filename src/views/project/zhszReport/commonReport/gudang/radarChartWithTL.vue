<template>
  <div class="chartBox" ref="radarChart"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'radarChart',
    props:{
       "radarData": Array,
       "special":{
         type: Boolean,
         default: false,
       }
    },
    mounted() {
      console.log(this.radarData,"  ")
      if(this.special){
        this.initSpecialChart();
      } else {
        this.initChart();
      }      
    },
    methods:{
        initChart(){
            let radarChart = echarts.init(this.$refs.radarChart);
            var option = {
                color: ['#ed9710','#206bef','#13cf8f'],
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
                    icon: 'circle',
                    orient: 'vertical',
                    top: '76',
                    left: '40',
                    data: [],   //几个类别
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
                    radius: '60%',
                    center: ['50%','50%'],
                    indicator: [],        
                    //几个棱角 { name: '安全卫士', max: 5},
                    splitArea: {
                    areaStyle: {
                        color: ['#fff','#eee']
                    }
                    }
                },
                series: [{
                    type: 'radar',
                    areaStyle: {opacity:0.1},
                    data: []
                    // 棱角的数据 {value: [3, 5, 3, 2, 3, 5, 5, 3],name: '识字写词',},
                }]
            };

            for(let i=0;i<this.radarData.length;i++){
              option.legend.data.push(this.radarData[i].name);
              let valList = []
              for(let j=0;j<this.radarData[i].rwList.length;j++){
                  if(i==0){
                    option.radar.indicator.push({name:this.radarData[i].rwList[j].name,max:5});
                  }
                  valList.push(this.changeLevel(this.radarData[i].rwList[j].val));
              }
              option.series[0].data.push({value:valList,name:this.radarData[i].name});
            }            

            console.log(option,76)
            radarChart.setOption(option);
        },

        initSpecialChart(){
            let radarChart = echarts.init(this.$refs.radarChart);
            var option = {
                color: ['#ed9710','#206bef','#13cf8f'],
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
                    icon: 'circle',
                    orient: 'vertical',
                    top: '76',
                    left: '40',
                    data: [],   //几个类别
                },
                radar: [{
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#4c5058',
                            fontSize: 19,
                            fontWeight: 'bold',
                        }
                    },
                    radius: '60%',
                    center: ['50%','50%'],
                    indicator: [],        
                    //几个棱角 { name: '安全卫士', max: 5},
                    splitArea: {
                      areaStyle: {
                          color: ['#fff','#eee']
                      }
                    }
                },{
                    // shape: 'circle',
                    name:{
                        show: false
                    },
                    splitArea:{
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    radius: '60%',
                    center: ['50%','50%'],
                    indicator: [],        
                    //几个棱角 { name: '安全卫士', max: 5},
                }],
                series: [{
                    type: 'radar',
                    areaStyle: {opacity:0.1},
                    data: []
                    // 棱角的数据 {value: [3, 5, 3, 2, 3, 5, 5, 3],name: '识字写词',},
                },{
                    type: 'radar',
                    radarIndex: 1,
                    areaStyle: {opacity:0.1},
                    data: []
                    // 棱角的数据 {value: [3, 5, 3, 2, 3, 5, 5, 3],name: '识字写词',},
                }]
            };
            
            for(let i=0;i<this.radarData.length;i++){
              option.legend.data.push(this.radarData[i].name);
              let valList = []
              for(let j=0;j<this.radarData[i].rwList.length;j++){
                  if(this.radarData[i].name=='口语'){
                    option.radar[0].indicator.push({name:this.radarData[i].rwList[j].name,max:5});
                  } else if(this.radarData[i].name=='听力'){
                    option.radar[1].indicator.push({name:this.radarData[i].rwList[j].name,max:5});
                  }
                  valList.push(this.changeLevel(this.radarData[i].rwList[j].val));
              }
              if(this.radarData[i].name=='口语'){
                option.series[0].data.push({value:valList,name:this.radarData[i].name});
              } else {                
                option.series[1].data.push({value:valList,name:this.radarData[i].name});
              }
            }            
            option.radar[0].indicator = this.dislocation(option.radar[0].indicator,[1,4,2,5,3,6]);
            option.series[0].data[0].value = this.dislocation(option.series[0].data[0].value,[1,4,2,5,3,6]);
            console.log(option,76)
            radarChart.setOption(option);
        },
        // 原数组按顺序打乱
        dislocation(originArr,sort){
          var res = [];
          sort.forEach((e,ind)=>{
            res[ind] = originArr[e-1];
          })
          return res;
        },

        changeLevel(val){
            switch(val){
                case "优秀":
                    return 5
                    break;
                case "良好":
                    return 3
                    break;
                case "合格":
                    return 2
                    break;
                case "待评":
                    return 1
                    break;
                case "不合格":
                    return 0
                    break;
            }
        }
    },
  }
</script>

<style scoped lang="scss">
  .chartBox{
    height: 100%;
    width: 100%;
  }
</style>
