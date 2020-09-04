<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="title">体质与健康</div>
          <div class="physicalQuality">
            <table>
              <tr class="odd">
                <th rowspan="5" class="green">身体<br>基本<br>素质</th>
                <th colspan="2">身高</th>
                <th colspan="2">体重</th>
                <th colspan="2">脊柱侧弯度</th>
              </tr>
              <tr>
                <td colspan="2">{{physicalObj.sg || physicalObj.sg===0 || physicalObj.sg==='0' ? (isNumber(physicalObj.sg)?(physicalObj.sg+'CM'):physicalObj.sg):'--'}}</td>
                <td colspan="2">{{physicalObj.tz || physicalObj.tz===0 || physicalObj.tz==='0' ? (isNumber(physicalObj.tz)?(physicalObj.tz+'KG'):physicalObj.tz):'--'}}</td>
                <td colspan="2">{{healthObj.cwd || healthObj.cwd===0 || healthObj.cwd==='0' ? (isNumber(healthObj.cwd)?(healthObj.cwd+'°'):healthObj.cwd):'--'}}</td>
              </tr>
              <tr class="odd">
                <th colspan="2">视力</th>
                <th colspan="2">屈光度</th>
                <th colspan="3"></th>
              </tr>
              <tr>
                <td>左眼</td>
                <td>右眼</td>
                <td>左眼</td>
                <td>右眼</td>
              </tr>
              <tr>
                <td>{{healthObj.sl_zy || healthObj.sl_zy===0 || healthObj.sl_zy==='0'?healthObj.sl_zy:'--'}}</td>
                <td>{{healthObj.sl_yy || healthObj.sl_yy===0 || healthObj.sl_yy==='0'?healthObj.sl_yy:'--'}}</td>
                <td>{{healthObj.qgd_zy || healthObj.qgd_zy===0 || healthObj.qgd_zy==='0'? (isNumber(healthObj.qgd_zy)?(healthObj.qgd_zy+'°'):healthObj.qgd_zy):'--'}}</td>
                <td>{{healthObj.qgd_yy || healthObj.qgd_yy===0 || healthObj.qgd_yy==='0'? (isNumber(healthObj.qgd_yy)?(healthObj.qgd_yy+'°'):healthObj.qgd_yy):'--'}}</td>
              </tr>
            </table>
          </div>
          <div class="suggestion">
            <table>
              <tr class="odd">
                <th class="green">体质<br>健康<br>建议</th>
                <td>
                  <p class="suggestText" v-html="suggest">
                  </p>
                </td>
              </tr>
            </table>            
          </div>
          <div class="healthChart">
            <lineChart :chartData="chartData"></lineChart>
          </div>
        </div>





    </div>
</template>

<script>
import reportHead from './headInfo.vue'
import lineChart from './lineChart.vue'
export default {
    name: "setReport",
    components: {
      reportHead,
      lineChart
    },
    props:[
       "bgdInfo",
       "pageInfo"
    ],
    data() {
        return {
          physicalQuality: null,
          suggest: '',
          physicalObj:{},
          healthObj:{},
          chartData: [],
        }
    },
    created(){
      this.getPageInfo();
    },
    methods: {
      getRealValue(plana,planb){
        var aisNull = !plana && typeof(plana)!='undefined' && plana!=0;
        var bisNull = !planb && typeof(planb)!='undefined' && planb!=0
        if(aisNull || typeof(plana)==='undefined' || plana==''){
          // plana无效
          if(bisNull || typeof(plana)==='undefined'){
          // planb无效
            return '';
          } else {
            return planb;
          }          
        }
        return plana;
      },
      isNumber(val){
        return !isNaN(val);
      },
      getPageInfo(){
        console.log(this.pageInfo,"健康体质页面数据")

        this.physicalQuality = _.find(this.pageInfo.bgdItemlist,{"bm":"体质与健康"});
        
        let physicalRwList = this.physicalQuality.xmReportList.length && _.find(this.physicalQuality.xmReportList,{"mc":"身高体重"}).rwList;
        let healthRwList = this.physicalQuality.xmReportList.length && _.find(this.physicalQuality.xmReportList,{"mc":"卫生数据"}).rwList;

        this.physicalObj.sg = physicalRwList ? this.getRealValue(_.find(physicalRwList,{"mc":"身高"}).twnr,_.find(physicalRwList,{"mc":"身高"}).twfz):'';
        this.physicalObj.tz = physicalRwList ? this.getRealValue(_.find(physicalRwList,{"mc":"体重"}).twnr, _.find(physicalRwList,{"mc":"体重"}).twfz):'';

        this.healthObj.sl_zy = healthRwList ? this.getRealValue(_.find(healthRwList,{"mc":"视力-左眼"}).twnr, _.find(healthRwList,{"mc":"视力-左眼"}).twfz):'';
        this.healthObj.sl_yy = healthRwList ? this.getRealValue(_.find(healthRwList,{"mc":"视力-右眼"}).twnr, _.find(healthRwList,{"mc":"视力-右眼"}).twfz):'';
        this.healthObj.qgd_zy = healthRwList ? this.getRealValue(_.find(healthRwList,{"mc":"屈光度-左眼"}).twnr, _.find(healthRwList,{"mc":"屈光度-左眼"}).twfz):'';
        this.healthObj.qgd_yy = healthRwList ? this.getRealValue(_.find(healthRwList,{"mc":"屈光度-右眼"}).twnr, _.find(healthRwList,{"mc":"屈光度-右眼"}).twfz):'';
        this.healthObj.cwd = healthRwList ? this.getRealValue(_.find(healthRwList,{"mc":"脊柱侧弯度"}).twnr, _.find(healthRwList,{"mc":"脊柱侧弯度"}).twfz):'';

        
        // this.suggest = _.find(this.pageInfo.bgdItemlist,{"bm":'健康指导建议'});
        this.physicalQuality = this.physicalQuality.xmReportList;
        
        this.chartData = [{
          xq: this.bgdInfo.bgd.xn.split('-')[0] + '\n学年\n' + (this.bgdInfo.bgd.xq=='01'?'第一\n学期':'第二\n学期'),
          sg: this.physicalObj.sg,
          tz: this.physicalObj.tz
        }];
        
        
        this.getSuggest();
      },
      getSuggest(){
        var sg = Number(this.physicalObj.sg)/100;
        var tz = Number(this.physicalObj.tz);
        var bmi = tz/(sg*sg);
          
          // 体重
          if(bmi>=28){
              this.suggest = this.suggest + "<b>肥胖：</b>体重超标，请科学减肥，戒除不良生活习惯，必要时专科医院就诊<br>"
          }else if(bmi>=24&&bmi<28){
              this.suggest = this.suggest + "<b>偏胖：</b>多做体育运动，不挑食，不偏食，少吃油炸食品，多吃绿色蔬菜<br>"
          }else if(bmi>=18.5&&bmi<24){
              this.suggest = this.suggest + "<b>正常：</b>体重标准，请继续保持，多做运动，合理膳食<br>"
          }else if(bmi<18.5){
              this.suggest = this.suggest + "<b>偏瘦：</b>多做力量运动，均衡摄入营养	，保持良好睡眠<br>"
          }
          
          // 视力
          if((parseFloat(this.healthObj.sl_zy)>=5.0)&&(parseFloat(this.healthObj.sl_yy)>=5.0)){
              this.suggest = this.suggest + "<b>视力：</b>视力正常，请定期检查视力，注意用眼卫生，多做眼保健操<br>"
          }else{
              this.suggest = this.suggest + "<b>视力：</b>视力不良，请注意用眼，平时多吃绿色蔬菜，多做户外运动，常晒太阳<br>"
          }
          // console.log(this.suggest,135)
      },
    }
}
</script>

<style scoped lang="scss">
.innerTemplate{
    padding: 0;
    width:1000px;
    height:1415px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .2);
    position: relative;
    // transform: scale(.7);
    // transform-origin: top left;
    // zoom:.7;
    float: left;
}

.physicalHealth{
    background: url('/static/report/gudang/normal_bg.jpg') no-repeat;
    background-size:100% 100%;
    .tables{
      width: 840px;
      height: 1171px;
      background-color: rgba($color: #fff, $alpha: 0.8);
      border-radius: 16px;
      position: relative;
      top: 77px;
      margin: 0 auto;
      .title{
        width: 100%;
        height: 66px;
        background-color: #33aa44;
        border-radius: 16px 16px 0px 0px;
        font-size: 29px;
        line-height: 66px;
        text-align: center;
        font-weight: bold;
        color: #fff;
      }
      table{
        height: 100%;
        width: 100%;
        text-align: center;
        background-color: #fff;
        th{
          color: #4c5058;
          font-size: 24px;
          text-align: center;
          &.green{
            background-color: #bdf5c5;
          }
        }
        td{
          color: #4c5058;
          font-size: 19px;
        }
        tr{
          height: 57px;
          &.odd{
            background-color: #eefcf0;
          }
        }
      }
    }
    .physicalQuality{
      width: 100%;
      height: 283px;
      padding: 0 16px;
      margin-top: 15px;
    }
    .suggestion{
      width: 100%;
      height: 227px;
      padding: 0 16px;
      margin-top: 15px;
      .green{
        width: 121px;
      }
      .suggestText{
        height: 100%;
        width: 100%;
        padding: 23px 24px;
        text-align: left;
      }
    }
    .healthChart{
      margin: 0 auto;
      margin-top: 15px;
      width: 808px;
      height: 461px;
      background-color: #eefcf0;
    }
}

</style>
