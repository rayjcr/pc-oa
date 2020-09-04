<template>
  <!-- 长青求知报告单 -->
  <div class="sltable">
      <h3 class="tabletitle" style="text-align:center">{{bgdmc}}</h3>
      <p style="text-align:center"><span>班级</span><span style="width: 160px;margin-right: 20px; display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.bj}}</span><span>姓名</span><span style="width: 100px;display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.xm}}</span></p>
      <table ref="bgdtb" border="1" style="width:100%;text-align:center" >
        <tr>
            <th colspan="2" rowspan="2" style="width: 50%;position: relative;overflow: hidden;">
                <span style="float:left;margin-top:20px;">课程</span>
                <span  class="afterline">成绩</span>
                <span style="float:right;">年级</span>
            </th>
            <th colspan="2">第一学期</th>
        </tr>   
        <tr>
            <th style="width:20%">成绩</th>
            <th>评价（情感/态度）</th>
        </tr>
        <div v-for="(item,findex) in tableData" :key="findex" style="display: table-row-group;">
          <tr>
            <th :rowspan="item.tabledata.length>1?item.tabledata.length/2:(item.tabledata.length==0?1:2)" :colspan="item.tabledata.length==2||item.tabledata.length==0?2:1">{{item.kcmc}}</th>
            <th v-if="!(item.tabledata.length==2||item.tabledata.length==0)">{{item.tabledata.length>0?item.tabledata[0].xm:''}}</th>
            <td >{{item.tabledata.length>0?item.tabledata[0].dj:''}}</td>
            <td >{{item.tabledata.length>0?item.tabledata[1].dj:''}}</td>
          </tr> 
          <tr v-for="(bgd,bgdind) in item.tabledata" :key="bgdind" v-if="item.tabledata.length>2&&bgdind!=0&&1!=bgdind%2">
            <th >{{bgd.xm}}</th>
            <td >{{bgd.dj}}</td>
            <td>{{item.tabledata[bgdind+1].dj}}</td>
          </tr>
        </div>
        <tr>
          <th>出勤情况</th>
          <td v-if="infoType" colspan="3">
            <div style="    line-height: 28px;">上课<span style="text-decoration:underline">{{reporttable[0].ycq}}</span>天；  实到<span style="text-decoration:underline">{{reporttable[0].ycq-reporttable[0].sj-reporttable[0].kk-reporttable[0].bj}}</span>天； 迟到<span style="text-decoration:underline">{{reporttable[0].cdzt}}</span>天</div>
            <div style="    line-height: 28px;">事假<span style="text-decoration:underline">{{reporttable[0].sj}}</span>天；  旷课<span style="text-decoration:underline">{{reporttable[0].kk}}</span>天； 病假<span style="text-decoration:underline">{{reporttable[0].bj}}</span>天</div>
          </td>
          <td v-else colspan="3">
            <div style="    line-height: 28px;">上课<el-input size="mini" style="width: 50px;" v-model="formdata.ycqts" placeholder="请输入内容" :maxlength="2"></el-input>天；  实到<el-input size="mini" style="width: 50px;" disabled v-model="getsdsj" placeholder="请输入内容" :maxlength="2"></el-input>天； 迟到<el-input size="mini" style="width: 50px;" v-model="formdata.cdzts" placeholder="请输入内容" :maxlength="2"></el-input> 天</div>
            <div style="    line-height: 28px;">事假<el-input size="mini" style="width: 50px;" v-model="formdata.sjts" placeholder="请输入内容" :maxlength="2"></el-input>天；  旷课<el-input size="mini" style="width: 50px;" v-model="formdata.kks" placeholder="请输入内容" :maxlength="2"></el-input>天； 病假<el-input size="mini" style="width: 50px;" v-model="formdata.bjts" placeholder="请输入内容" :maxlength="2"></el-input>天</div>
          </td>
        </tr>
        <tr>
          <th>信息窗</th>
          <td colspan="3">
            <!-- <textarea v-if="!infoType" name="fy" style="margin: 0px; width: 100%; height: 34px;" cols="30" rows="1" v-model="formdata.fy"></textarea> -->
            <div style="    line-height: 28px;">{{fy}}</div> 
          </td>
        </tr>    
      </table>
      <div class="qmlist">
          <span v-for="(qm,qmind) in sortqmurl" :key="qmind" class="qmspanlist">
            <div style='display:inline-block;text-align:left;width:200px;overflow:hidden;line-height: 30px;'>{{qm.zc==''?'班主任':qm.zc}}：<img v-if="qm.qm&&qm.qm.indexOf('http')!=-1" :src="qm.qm" /> <span v-else>{{qm.qm}}</span></div>
          </span>
          <span v-if="!qmurl" class="qmspanlist"><span>校长：</span> <span>教务主任：</span> <span>班主任：</span></span>
      </div>                        
  </div>   
</template>
<script>
  export default {
    name: 'A03mb',
    props:{
      tableData:{
        type: Array
      },
      bgdmc:{
        type: String
      },
      bdtxx:{
        type: Object
      },
      reporttable:{
        type: Array
      },
      listQuery:{
        type: Object
      },
      infoType:{
        type: Boolean,
        default: true
      },
      formdata:{
        type: Object
      },
      qmurl:{
        type: Array
      },
      fy:{
        type: String,
        default: ''
      }
    },
    data(){
      return{

      }
    },
    computed:{
      getsdsj(){
        return this.$props.formdata.ycqts-this.$props.formdata.sjts-this.$props.formdata.bjts-this.$props.formdata.kks
      },
      sortqmurl(){
        var sz = [{zc: '校长',qm: ''},{zc: '教务主任',qm: ''},{zc: '班主任',qm: ''}]
        for(var i=0;i<3;i++){
          if(i>=this.$props.qmurl.length){
            return sz
          }
          if(this.$props.qmurl[i].zc == ''){//班主任
            sz[2] = this.$props.qmurl[i];
          } 
          if(this.$props.qmurl[i].zc == '校长'){//班主任
            sz[0] = this.$props.qmurl[i];
          } 
          if(this.$props.qmurl[i].zc == '教务主任'){//班主任
            sz[1] = this.$props.qmurl[i];
          }     
        }
        return sz
      },  
    },
    methods:{

    }
  }
</script>
<style scoped>
.sltable table{
  position: relative;
}
.afterline::after{
    content: "";
    position: absolute;
    width: 1px;
    height: 900%;
    top: 50%;
    left: 0;
    background-color: #000;
    display: block;
    -webkit-transform: rotate(-87deg);
    transform: rotate(-87deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    -ms-transform: rotate(-87deg);
    -ms-transform-origin: top;
}
.afterline::before{
    content: "";
    position: absolute;
    width: 1px;
    height: 462%;
    top: 1px;
    left: 50%;
    background-color: #000;
    display: block;
    -webkit-transform: rotate(-78deg);
    transform: rotate(-78deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    -ms-transform: rotate(-78deg);
    -ms-transform-origin: top;
}
table th,table td{
  padding-left:5px;
  text-align: center;
  vertical-align: middle;
}
.qmlist{
  text-align: center;
}
.qmlist img{
  max-height: 30px;
  max-width: 180px;
}
.qmspanlist span{
  /* margin-right: 100px; */
}
</style>

