<template>
  <!-- 胜蓝报告单 -->
  <div class="sltable">
      <h3 class="tabletitle" style="text-align:center">{{bgdmc}}</h3>
      <p style="text-align:center"><span>班级</span><span style="margin-right: 20px; display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.bj}}</span><span>姓名</span><span style="width: 100px;display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.xm}}</span></p>
      <table ref="bgdtb" border="1" >
        <tr height='22'>
            <th width="25%" id="lineTd" colspan="2">
                <span style="float:left;margin-top:20px;">课程</span>
                <span style="float:right;">评价</span>
            </th>
            <th width="12.5%">知识能力</th>
            <th width="12.5%">态度习惯</th>
            <th width="25%">班主任寄语</th>
            <th width="25%">身体状况</th>
        </tr>
        <div v-for="(item,findex) in tableData" :key="findex" style="display: contents;">                                     
          <tr v-if="item.tabledata.length>0" height='22'>
            <th :rowspan="item.tabledata.length-1" :colspan="item.tabledata[0].fx=='知识能力'||item.tabledata[0].fx=='态度习惯'?2:1">{{item.kcmc}}</th>
            <th v-if="item.tabledata[0].fx!='知识能力'&&item.tabledata[0].fx!='态度习惯'">{{item.tabledata[0].fx}}</th>
            <td >{{item.tabledata[0].dj}}</td>
            <td :rowspan="item.tabledata.length-1">{{item.tabledata[item.tabledata.length-1].dj}}</td>
            <td :rowspan="allrowspan" v-if="findex==0" style="padding:0">
              <!-- 班主任寄语 -->
              <table border='1' style="border:0;width:100%">
                <tr></tr>
                <tr height='22'>
                  <td :height="bzrjyheight">
                    <textarea 
                      :cols="20"
                      :rows="9" 
                      style="border:none;height:95%;width:100%;background:#fff;resize:none;margin:0;text-indent: 2rem;"
                      :style="infoType?'overflow:hidden':''"
                      placeholder="暂无内容"
                      v-model="reporttable[2].bzrjy"
                      @input="changebzrjy(reporttable[2].bzrjy)"
                      :disabled='infoType'
                      >                            
                    </textarea>
                  </td>
                </tr>
                <tr height='22'>
                    <th>所获荣誉</th>
                <tr height='22'>
                  <td :height='shryheight'>
                    <textarea 
                      :cols="10"
                      :rows="4" 
                      style="border:none;height:95%;width:100%;background:#fff;resize:none;margin:0;"
                      :style="infoType?'overflow:hidden':''"
                      placeholder="暂无内容"
                      v-model="reporttable[1].jcjl"
                      @input="changejcjl(reporttable[1].jcjl)"
                      :disabled='infoType'
                      >                            
                    </textarea>
                  </td>
                </tr> 
              </table>
              <!-- /班主任寄语 -->
            </td>
            <td :rowspan="allrowspan" v-if="findex==0" style="padding:0">
              <!-- 身体状况 -->
              <table border='1' style="border:0;width:100%">
                <tr></tr>
                <div style="display: contents;text-align: center">
                  <tr><th v-if="tydata">{{tydata.mc}}</th></tr>
                  <tr v-if="typeof(tydata)=='undefined'"></tr>
                  <div v-else v-for="(item,index) of tydata.zxmList" :key="index" style="display:contents;">
                      <tr>
                          <th height='22'>{{item.mc}}</th>
                      </tr>      
                      <tr v-if="item.jflx==4">
                          <td height='22'>{{item.rwList[0].twnr}}</td>
                      </tr>                             
                      <tr v-else v-for="(rw,rwind) of item.rwList" :key="rwind">
                          <td height='22'>{{rw.mc!=item.mc?rw.mc+(item.mc=='身高'?'(厘米)':item.mc=='体重'?'(千克)':'')+':':''}}{{parseFloat(rw.sz).toFixed(1)}}</td>
                      </tr>
                  </div>
                  <tr v-for="n in khgd">
                      <td height='22'> </td>
                  </tr>                  
                </div>
                <tr>
                  <td :height="shryheight/2+21">
                    <p v-if="!infoType" style="text-indent:28px">
                      本学期授课共<el-input size="mini" style="width: 50px;text-indent: 0;" v-model="formdata.ycqts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
                      请假 <el-input size="mini" style="width: 50px;text-indent: 0;" v-model="formdata.sjts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
                      旷（缺）课 <el-input size="mini" style="width: 50px;text-indent: 0;" v-model="formdata.kks" placeholder="请输入内容" :maxlength="2"></el-input> 天
                    </p>
                    <p v-else>本学期授课共{{reporttable[0].ycq}}天，请假{{reporttable[0].sj+reporttable[0].bj}}天，旷（缺）课{{reporttable[0].kk}}天</p>
                  </td>
                </tr>
                <tr>
                  <td :height="shryheight/2">
                    <div v-for="(qm,ind) in sortqmurl" :key="ind">
                      {{qm.zc==''?'班主任':qm.zc}}：
                      <!-- <img v-if="qm.qm&&qm.qm.indexOf('http')!=-1" :src="qm.qm" style="height:auto;width:auto;max-width:100px"> <span v-else>{{qm.qm}}</span> -->
                    </div>
                  </td>
                </tr>
              </table>
              <!-- /身体状况 -->
            </td>
          </tr>
          <tr v-else>
            <th colspan="2">{{item.kcmc}}</th>
            <td>暂无数据</td>
            <td>暂无数据</td>
            <td :rowspan="allrowspan" v-if="findex==0" style="padding:0">
              <!-- 班主任寄语 -->
              <table border='1' style="border:0;width:100%">
                <tr></tr>
                <tr height='22'>
                  <td :height="bzrjyheight">
                    <textarea 
                      :cols="20"
                      :rows="9" 
                      style="border:none;height:95%;width:100%;background:#fff;resize:none;margin:0;"
                      :style="infoType?'overflow:hidden':''"
                      placeholder="暂无内容"
                      v-model="reporttable[2].bzrjy"
                      @input="changebzrjy(reporttable[2].bzrjy)"
                      :disabled='infoType'
                      >                            
                    </textarea>
                  </td>
                </tr>
                <tr height='22'>
                    <th>所获荣誉</th>
                <tr height='22'>
                  <td :height='shryheight'>
                    <textarea 
                      :cols="10"
                      :rows="4" 
                      style="border:none;height:95%;width:100%;background:#fff;resize:none;margin:0;"
                      :style="infoType?'overflow:hidden':''"
                      placeholder="暂无内容"
                      v-model="reporttable[1].jcjl"
                      @input="changejcjl(reporttable[1].jcjl)"
                      :disabled='infoType'
                      >                            
                    </textarea>
                  </td>
                </tr> 
              </table>
              <!-- 班主任寄语 -->
            </td>
            <td :rowspan="allrowspan" v-if="findex==0" style="padding:0">
              <!-- 身体状况 -->
              <table border='1' style="border:0;width:100%">
                <tr></tr>
                <div style="display: contents;text-align: center">
                  <tr><th v-if="tydata">{{tydata.mc}}</th></tr>
                  <tr v-if="typeof(tydata)=='undefined'"></tr>
                  <div v-else v-for="(item,index) of tydata.zxmList" :key="index" style="display:contents;">
                      <tr>
                          <th height='22'>{{item.mc}}</th>
                      </tr>      
                      <tr v-if="item.jflx==4">
                          <td height='22'>{{item.rwList[0].twnr}}</td>
                      </tr>                             
                      <tr v-else v-for="(rw,rwind) of item.rwList" :key="rwind">
                          <td height='22'>{{rw.mc!=item.mc?rw.mc+':':''}}{{rw.sz}}</td>
                      </tr>
                  </div>
                  <tr v-for="n in khgd">
                      <td height='22'> </td>
                  </tr>
                </div>
                <tr>
                  <td :height="shryheight/2+22">
                    <p v-if="!infoType" style="text-indent:28px">
                      本学期授课共<el-input size="mini" style="width: 50px;text-indent: 0;" v-model="formdata.ycqts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
                      请假 <el-input size="mini" style="width: 50px;text-indent: 0;" v-model="formdata.sjts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
                      旷（缺）课 <el-input size="mini" style="width: 50px;text-indent: 0;" v-model="formdata.kks" placeholder="请输入内容" :maxlength="2"></el-input> 天
                    </p>
                    <p v-else>本学期授课共{{reporttable[0].ycq}}天，请假{{reporttable[0].sj+reporttable[0].bj}}天，旷（缺）课{{reporttable[0].kk}}天</p>
                  </td>
                </tr>
                <tr>
                  <td :height="shryheight/2">
                    <div v-for="(qm,ind) in sortqmurl" :key="ind">
                      {{qm.zc==''?'班主任':qm.zc}}：
                      <!-- <img v-if="qm.qm&&qm.qm.indexOf('http')!=-1" :src="qm.qm" style="height: auto;width: auto;max-width: 240px;max-height: 40px;"> <span v-else>{{qm.qm}}</span> -->
                    </div>
                  </td>
                </tr>
              </table>
              <!-- /身体状况 -->
            </td>
          </tr>
          <tr height='22' v-for="(bgd,bgdind) in item.tabledata" v-if="item.tabledata.length>0&&bgdind!=0&&bgdind!=item.tabledata.length-1" :key="bgdind">
            <th >{{bgd.fx}}</th>
            <td >{{bgd.dj}}</td>
          </tr>
        </div>
      </table>   
      <textarea v-if="!infoType" name="fy" style="margin: 0px; width: 100%; height: 27px;" cols="30" rows="1" v-model="formdata.fy"></textarea>
      <p v-else>{{reporttable[3].fy}}</p>                     
      <div class="bgdfm">
          <img class="schoollogo" :src="xxlogo" alt="">
          <img class="schoollogosmall" :src="xxlogo" alt=""><img class="schoolimg" :src="xximg" alt="">
          <div class="bgdinfo">
              <div class="title">{{bgdmc}}<div class="bgdxnxq">({{dqxn}}学年{{listQuery.xq=='01'?'第一':'第二'}}学期)</div></div>
              <div class="njbj">{{bdtxx.bj}}</div>
              <div class="xm">姓名：{{bdtxx.xm}}</div>
              <div class="shijian">{{year}} 年 {{month}} 月</div>
          </div>
      </div>   
  </div>   
</template>
<script>
  import {getXxdmInfo} from 'api/admin/school/index'
  export default {
    name: 'A02mb',
    props:{
      tableData:{
        type: Array,
        default: [],
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
      tydata:{
        type: Object
      }

    },
    data(){
      return{
        showTableData: [],
        bzrjyheight: 0,//班主任寄语高度
        shryheight: 0,//所获荣誉高度
        allrowspan:0,//右边那一块占的行数
        mbinfo:{},//获取到的模板信息
        year: 0,//报告单封面的年
        month: 0,//报告单封面的月
        xxlogo: '',//报告单封面的学校logo
        xximg: '',//报告单封面的学校图片
        xxdm: '',//获取封面图片的xxdm,
        dqxn: '',//当前学年
        khgd: 0,//右侧空行高度
      }
    },
    watch:{
      tableData(value){
        this.countHeight(value);
      }
    },
    methods:{
      //计算班主任寄语和所获荣誉高度
      countHeight(value){
        var lineCount = 0;
        var tableData = value//获取传入的数据
        console.log(tableData,273)
        for(let row of tableData){//循环
          if(row.kcmc.indexOf('体质')!=-1){//如果课程名称是体质健康
            // 整个不显示
            var index = tableData.findIndex((e)=>e.kcmc==row.kcmc)
            if(index>=0){
              tableData.splice(index,1);
            }
            console.log(row,281)
          }          
          if(row.tabledata.length>0){
            lineCount += (row.tabledata.length -1)//减去态度习惯
          } else {
            lineCount++;
          } 
        }
        this.showTableData = tableData
        this.bzrjyheight = Math.round(lineCount*0.6); 
        this.shryheight = lineCount - this.bzrjyheight -1;
        this.allrowspan = lineCount;        
        this.khgd = this.bzrjyheight - (this.tydata&&this.tydata.zxmList?this.tydata.zxmList.length*2+2:0)
        this.khgd = this.khgd>0?this.khgd:0;
        this.bzrjyheight*=22;//行高固定22
        this.shryheight*=22;      
        return true;
      },
      //修改班主任寄语
      changebzrjy(value){
        this.$props.formdata.bzrjy = value
      },
      //修改奖惩记录
      changejcjl(value){
        this.$props.formdata.jcjz = value
      },

      getBgdfm(){      
        getXxdmInfo({xxdm: window.localStorage.getItem('xxdm'),}).then(response => {
            this.xxlogo = response.data.path
            this.xximg = response.data.imagePath
        })
      }
    },
    mounted(){
      this.xxdm=window.localStorage.getItem('xxdm');
      this.xxdm = this.xxdm?this.xxdm:'';
      this.year=window.localStorage.getItem('edittime').split('-')[0];
      this.year = this.year?this.year:'';
      this.month=window.localStorage.getItem('edittime').split('-')[1];
      this.month = this.month?this.month:'';
      this.dqxn=this.listQuery.xn.split('-')[0];
      this.dqxn = this.dqxn?this.dqxn:'';
      this.getBgdfm();
      if(this.$props.tableData){
        this.countHeight(this.$props.tableData);
      }
    },
    computed:{
      sortqmurl(){
        var sz = [{zc: '班主任',qm: ''},{zc: '教务主任',qm: ''},{zc: '校长',qm: ''}]
        for(var i=0;i<3;i++){
          if(i>=this.$props.qmurl.length){
            return sz
          }
          if(this.$props.qmurl[i].zc == ''){//班主任
            sz[0] = this.$props.qmurl[i];
          } 
          if(this.$props.qmurl[i].zc == '校长'){//班主任
            sz[2] = this.$props.qmurl[i];
          } 
          if(this.$props.qmurl[i].zc == '教务主任'){//班主任
            sz[1] = this.$props.qmurl[i];
          }     
        }
        return sz
      },   
      countTableHeight(){
        this.countHeight(this.$props.tableData);
        return 1;
      },
    },
  }
</script>
<style scoped>
    #lineTd {
            background: #fff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=) no-repeat 100% center;
    }
    .bgdfm{
        /* background:#fdeadb; */
        /* background: url('../../../../../static/img/bgdfmbg.jpg'); */
        background-size: 100% auto;
        height: 1146px;
        padding: 100px 80px;
        position: relative;
                zoom: 0.6;
    }
    .bgdfm .schoollogo{
      position: relative;
      height: 21%;
      width: auto;
      top: 372px;
      left: 208px;
        /* background-color: #000; */
    }
    .bgdfm .schoolimg{
        position: absolute;
        height: 80px;
        width: auto;
        top: 238px;
        right: 153px;
        /* background-color: #fff;     */
    }
    .bgdfm .schoollogosmall{
        position: absolute;
        height: 110px;
        width: auto;
        top: 233px;
        right: 614px;
    }
    .bgdfm .bgdinfo{
        float: right;
        position: relative;
        width: 525px;
    }
    .bgdinfo .title{
        position: absolute;
        /* left: -115px; */
        top: 351px;
        font-size: 30px;
        min-width: 470px;
        /* text-indent: -100px; */
        font-family: monospace;
        font-weight: bolder;
        text-align: center;
    }
    .bgdinfo .title .bgdxnxq{
        margin-top: 21px;
        /* margin-left: 52px; */
    }
    .bgdinfo .njbj{
        position: absolute;
        left: 80px;
        top: 550px;
        font-size: 26px;
        font-family: monospace;
        font-weight: bold;
    }
    .bgdinfo .xm{
        position: absolute;
        left: 102px;
        top: 640px;
        font-family: monospace;
        font-size: 26px;
        font-weight: 500;
    }
    .bgdinfo .shijian{
        position: absolute;
        top: 715px;
        left: 105px;
        font-size: 26px;
        font-family: monospace;
        font-weight: 500;
        letter-spacing: 3px;
    }
    table th,table td{
      padding-left:5px;
    }
</style>


