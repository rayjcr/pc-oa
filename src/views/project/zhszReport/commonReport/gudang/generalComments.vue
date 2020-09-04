<template>
    <div class="innerTemplate physicalHealth">
        <reportHead :userImgPath="bgdInfo.studentInfo.tx" :userInfo="bgdInfo.bgdxx" :bgd='bgdInfo.bgd'></reportHead>
        
        <div class="tables">
          <div class="title">学科期末总结性评价</div>
          <div class="mainSubjects">
            <table>
              <tr class="green head">
                <th>学科</th>
                <th>评价项目</th>
                <th>平时</th>
                <th>期末</th>
              </tr>
              <tbody v-for="(subject,sind) in mainSubjectTable">
                <tr class="height7"></tr>
                <tr v-for="(item,ind) in subject.items" :class="{'zebra':item.odd}">
                  <th v-if="ind==0" class="lightGreen" :rowspan="subject.items.length">{{subject.name}}</th>
                  <td>{{item.itemName}}</td>
                  <td>{{item.peacetime}}</td>
                  <td>{{item.final}}</td>
                </tr>
              </tbody> 
              
              <tr class="height7"></tr>
              <tr class="green head">
                <th>学科</th>
                <th>评价项目</th>
                <th colspan="2">学科总评</th>
              </tr> 
              <tbody v-for="(subject,sind) in otherSubjectTalbe">
                <tr class="height7"></tr>
                <tr v-for="(item,ind) in subject.items" :class="{'zebra':item.odd}">
                  <th v-if="ind==0" class="lightGreen" :rowspan="subject.items.length">{{subject.name}}</th>
                  <td>{{item.itemName}}</td>
                  <td colspan="2">{{item.final}}</td>
                </tr>
              </tbody>             
            </table>
          </div>
        </div>
    </div>
</template>

<script>
import reportHead from './headInfo.vue'
export default {
    name: "setReport",
    components: {
      reportHead
    },
    props:[
       "bgdInfo",
       "pageInfo"
    ],
    data() {
        return {
           userPhotoListS:[0,1,2,3,4,5],
           userPhotoList:[],
           mbname:'',
           userImgPath:"",          //用户头像路径
           mainSubjectTable:[],
           otherSubjectTalbe:[]
        
        }
    },
    mounted(){


        // console.log(this.bgdInfo,86);
        this.getBgdData();
        console.log(this.bgdInfo,"学科期末总结性评价")
    },
    methods: {
      getBgdData(){
        var arr = _.filter(this.bgdInfo.page,{mb:'7'});
        var mainSubjectTable = _.filter(arr,e=>e.mc.indexOf('语文')>=0||e.mc.indexOf('数学')>=0||e.mc.indexOf('英语')>=0);
        var otherSubjectTalbe = _.filter(arr,e=>!(e.mc.indexOf('语文')>=0||e.mc.indexOf('数学')>=0||e.mc.indexOf('英语')>=0));
        this.mainSubjectTable = [];
        this.otherSubjectTalbe = [];
        let odd = false;
        // 主科目数据
        mainSubjectTable.forEach(e=>{
          let p = {
            name: e.bgdItemlist[0].kcmc,
            items: []
          }
          e.bgdItemlist[0].xmReportList.forEach(xm=>{
            let peacetime = xm.rwList.find(rw=>rw.mc=='平时')
            let final = xm.rwList.find(rw=>rw.mc=='期末')
            if(peacetime&&final){
              let item = {
                itemName: xm.mc,
                peacetime: peacetime?peacetime.twnr:'',
                final: final?final.twnr:'',
                odd: odd,
              }
              odd = !odd;
              p.items.push(item);              
            }
          })
          this.mainSubjectTable.push(p);
        })
        console.log(otherSubjectTalbe,191)
        // 其他科目数据
        otherSubjectTalbe.forEach(e=>{
          let p = {
            name: e.bgdItemlist[0].kcmc,
            items: []
          }
          if(e.mc.indexOf('科学')>=0||e.mc.indexOf('体育')>=0){
            // 科学、体育，显示名为“学科总评”的任务结果
            e.bgdItemlist[0].xmReportList.forEach(xm=>{
              let xkzp = xm.rwList.find(rw=>rw.mc=="学科总评");
              if(xkzp){
                let item = {
                  itemName: xm.mc,
                  final: xkzp.twnr,
                  odd: odd,
                } 
                odd = !odd;
                p.items.push(item);
              }
            })
          } else {
            // 音乐、美术、道德与法治、信息，综合实践显示“学科总评”项目下任务的结果
            let xkzp = e.bgdItemlist[0].xmReportList.find(xm=>xm.mc=="学科总评");
            if(xkzp){
              xkzp.rwList.forEach(rw=>{
                p.items.push({
                  itemName: rw.mc,
                  final: rw.twnr,
                  odd: odd,
                })
                odd = !odd;
              })
            }
          }
          this.otherSubjectTalbe.push(p);
        })
        console.log(this.otherSubjectTalbe,194)
      }
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

tr.zebra{
  background-color: #f7f7f7!important;
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
        // background-color: #fff;
        th{
          color: #4c5058;
          font-size: 24px;
          text-align: center;
          width: 80px;
          &.green{
            background-color: #bdf5c5;
          }
          &.lightGreen{
            background-color: #eefcf0;
          }
        }
        td{
          color: #4c5058;
          font-size: 19px;
        }
        tr{
          height: 35px;
          background-color: #fff;
          &.height7{
            height: 7px;
          }
          &.head{            
            height: 57px;
          }
          &.odd{
            background-color: #eefcf0;
          }
          &.green{
            background-color: #bdf5c5;
          }
          &.grey{
            background-color: #f7f7f7;
          }
          &.borderTop{
            border-top: 7px solid #fff;
          }
        }
      }
    }
    .mainSubjects{
      width: 100%;
      // height: 283px;
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
