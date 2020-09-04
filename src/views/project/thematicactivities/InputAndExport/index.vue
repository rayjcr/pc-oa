<!--
 * @Description: 主题活动报告单录入导出
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-15 10:22:05
 * @LastEditTime: 2019-04-23 15:40:07
 -->

 <template>
  <div class="app-container">
      <div class="clear">
          <el-form :model="formSearch" ref="Searchform" label-position="left" class="left">
              <el-row style="min-width:600px; padding-left:20px;">
                  <el-form-item label="学年学期">
                      <el-select v-model="formSearch.xn" clearable placeholder="选择学年" @change="searchFn">
                          <el-option v-for="(item,index) in xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
                      </el-select>
                      <el-select v-model="formSearch.xq" clearable placeholder="选择学期" @change="searchFn">
                          <el-option v-for="(item,index) in xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
                      </el-select>
                  </el-form-item>
              </el-row>
          </el-form>
      </div>
      <div class="t_conmain"  v-loading.body="listLoading">
          <p class="t_tips">注：<span>只有班主任和校管理员有录入、导出权限。报告单锁定后，教师将不能进行录入操作。</span></p>
          <el-card class="partbox-card" shadow="hover" v-for="(item,index) in reportList" :key="index">
              <div class="leftpart">
                  <div class="title">
                      <span class='titspan'>
                          <span>{{item.mc}}</span>
                      </span>
                      <span class="tip" :style="{background: item.lrsd? 'orange':'green',color:'#fff'}">{{item.lrsd?'已锁定':'可录入'}}</span>
                  </div>
                  <div class='info'>
                      <div class="infopt">学年学期：{{item.xn}}{{item.xq === '01'?'上学期':'下学期'}}</div>
                      <div class="infopt">最后编辑时间：{{item.gxsj}}</div>
                  </div>
              </div>
              <div class="rightpart">
                  <div class="sole"></div>
                  <div class='opt'>
                      <el-button type="text" @click='handleSet(item)'>录入</el-button>
                      <el-button type="text" @click='enteroutput(item)'>导出</el-button>
                  </div>
              </div>
          </el-card> 
          <div v-show="!listLoading" class="pagination-container" v-if='total>0'>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
          </div>
          <div v-if='!reportList || reportList.length<1' style="text-align:center">暂无报告单，请新建</div>
      </div>
  </div>
</template>

<script>
import  * as mainPapi from "api/project/mainProject/index";
import  * as reportapi from "api/project/report/index";
// import {school_page,getXn,getXq,getNj,getXk,dqxnxqObj,getBj,Getreport,Getreportset,Getjurisdiction,Getbzrinfo,Getallbjlist} from 'api/project/creditInquiry/index'
import * as mainapi from "api/project/creditInquiry/index"
export default {
    name: "setReport",
    components: {
    
    },
    data() {
        return {
            lguserType: window.localStorage.getItem('lguserType'), // 用户类型
            formSearch:{},          //搜索
            xnList:[],              //学年
            xqList:[],              //学期
            listQuery:{                
                xxdm: window.localStorage.getItem('xxdm'),
                pageIndex: 1,
                pageSize: 10,
                lx: 2,
            },
            xndm: '', // 学年代码
            total: null,                    //分页            
            listLoading: true,      // 页面加载
            reportList:[],          //报告单列表
            username: window.localStorage.getItem('username'), // 用户账号 （zgh = username去掉学校代码部分的字符串）
            dialogStatus:'',
            btnLimt: false,                 //防止重复点击BUG
            mbList:[],                      //报告单模板
            form:{},
            zgh: '', // 职工号
            bzrbj:[], // 班主任班级
            allclass: [], // 全校班级数据（管理员用）
        }
    },
    created() {        
        this.DictObj();
    },
    mounted(){
    },
    methods: {
        // 获取全校班级（管理员使用）
        getallclass(item, str){
            let params = {
                xxdm: this.listQuery.xxdm,
                dqxn: item.xn
            }
            let that = this
            mainapi.Getallbjlist(params).then(data => {
                // console.log(data)
                if (data.length) {
                    data.forEach(el => {
                        that.allclass.push({
                            bjdm: el.uuid,
                            bjmc: el.bj,
                            njdm: el.njdm,
                            xn: el.jbny,
                            students: []
                        })
                    })
                    if (that.allclass.length) {
                        this.savesessionStorage(that.allclass, 'bjsj')
                        if (str === 'lr') {
                            that.$router.push({path: '/thematicactivities/informationEntry', query:{zgh: that.zgh, bgdId: item.uuid, qx: 'gly'}})
                        } else {
                            that.$router.push({path: '/thematicactivities/informationExport', query:{zgh: that.zgh, bgdId: item.uuid, qx: 'gly'}})
                        }
                        
                    }
                }
                // else {}
                
            })
        },
        
        // 获取当前登陆人任班主任班级
        getbzrbj(item, str){
            // console.log(item)
            let params = {
                xxdm: this.listQuery.xxdm,
                zgh: this.zgh,
                xndm: item.xn,
            }
            mainapi.Getbzrinfo(params).then(data => {
                // console.log(data)
                var that = this
                if (data.status === 200 && data.data.length) {
                    item.byzD1.forEach((ite, iteindex) => {
                    that.dataprocessing(ite, data.data)
                    })
                }
                // console.log(this.bzrbj)
                if (this.bzrbj.length) {
                    this.savesessionStorage(this.bzrbj, 'bjsj')
                    if (str === 'lr') {
                        this.$router.push({path: '/thematicactivities/informationEntry', query:{zgh: this.zgh, bgdId: item.uuid, qx: 'js'}})
                    } else {
                        this.$router.push({path: '/thematicactivities/informationExport', query:{zgh: this.zgh, bgdId: item.uuid, qx: 'js'}})
                    }
                    // this.$router.push({path: '/thematicactivities/informationEntry', query:{zgh: this.zgh, bgdId: item.uuid, qx: 'js'}})
                } else {
                    this.tipsXX('您所在年级暂无数据！', 'info', '提示')
                }
            })
        },
        // 班主任班级数据处理
        dataprocessing(el, item){
            var that = this
            item.forEach((ite, iteindex) => {
                if (el.njdm === ite.njdm) {
                    that.bzrbj.push(ite)
                }
            })
        },
        
        // sessionStorage 存储
        savesessionStorage(datas, str){
            window.sessionStorage.setItem(str, JSON.stringify(datas))
        },

        //基础信息获取(学年学期\报告单模板)
        DictObj() {
            reportapi.getxnlb({ xxdm: this.listQuery.xxdm }).then(response => {
                this.xnList = response   
            })
            reportapi.getxqlb({ xxdm: this.listQuery.xxdm }).then(response => {
                this.xqList = response   
                this.getList() 
            })           
            // reportapi.GetReportTemplateList().then(response => {
            //     this.mbList = response
            // })
            var t = this.listQuery.xxdm.length
            this.zgh = this.username.substring(t)
        }, 

        // 条件搜索
        searchFn() {
            this.listQuery.xn =  this.formSearch.xn?this.formSearch.xn:undefined;
            this.listQuery.xq =  this.formSearch.xq?this.formSearch.xq:undefined;
            this.getList()
        },

        // 报告列表
        getList(){
            var that = this
            this.listLoading = true;
            mainapi.Getreport(this.listQuery).then(response => {
                // console.log(response)
                this.reportList = response.list
                this.total = response.totalCount
                this.listLoading = false;
            })
        },  
             
        // 分页
        handleSizeChange(val) {
            this.listQuery.pageSize = val
            this.getList()
        },

        // 分页
        handleCurrentChange(val) {
            this.listQuery.pageIndex = val;
            this.getList();
        },

        // 进入报告单导出数据界面
        enteroutput(item){ 
            // console.log(item)
            this.savesessionStorage(item.xn, 'reportxn')
            this.xndm = item.xn
            if (this.lguserType === '2') {  // 管理员判定获取全校班级及学生
                this.getallclass(item, 'dc')
            } else { // 非管理员人员进入下个流程
                this.getbzrbj(item, 'dc')
            }
        },

        // 进入报告单录入
        handleSet(item){
            // console.log(item)
            if (item.lrsd) {
                this.tipsXX('已锁定，不可录入', 'info', '提示')
            } else {
                this.xndm = item.xn
                this.savesessionStorage(item.xn, 'reportxn')
                if (this.lguserType === '2') {  // 管理员判定获取全校班级及学生
                    this.getallclass(item, 'lr')
                } else { // 非管理员人员进入下个流程
                    this.getbzrbj(item, 'lr')
                }
            }
        },    

        //提示信息
        // info
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit,
                message: data,
                type: xxtype,
                duration: 2000
            });
        },
    }
}
</script>

<style scoped lang="scss">
  .left{
      float: left;
  }
  .right{
      float: right;
  }
  .app-container{
      min-width: 740px; max-width: 1200px;
  }
  .t_conmain{
      padding-left: 20px;
      overflow: hidden;
  }
  .t_tips{
      span{ 
          color: #aaa;
      }
  }
    .tip{
        margin-left: 20px;
        display: inline-block;
        width: 60px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: rebeccapurple;
        border-radius: 15px;
    }
  .partbox-card{
      height: 100px; 
      cursor: default;
      margin-bottom: 10px;
      .leftpart{
          float: left;
          .title{
              height: 40px; line-height: 40px; color: #000; font-size: 14px;
              .el-input{ float: left; min-width: 450px; width: auto;}
              .titspan{
                  cursor: pointer; 
                  span{
                      float: left; 
                      max-width: 470px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
                  }
                  
              }
              .el-icon-edit{
                  color: #409EFF; margin-left: 10px;
                  font-size: 16px; font-style: italic;
              }
          }
          .info{
              height: 40px; line-height: 40px; font-size: 14px;
              .infopt{
                  float: left; margin-right: 10px;
              }
          }
      }
      .rightpart{
          float: right; 
          .sole{
              height: 40px; line-height: 40px; 
          }
          .opt{
              height: 40px; line-height: 40px;
          }
      }
  }
</style>
<style>
.partbox-card .el-card__body{ padding: 10px 20px;}
/* .partbox-card .el-input__inner{ color: #000;} */
</style>