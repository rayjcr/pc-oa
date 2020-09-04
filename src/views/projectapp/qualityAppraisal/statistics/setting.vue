<template>
    <div class="app-container calendar-list-container">
        <div class="u_TableMain block ofhide">

            <div class="filter-container">
                <div v-if="!detailFlg">
                    <span class="filterTit">学年学期：</span>
                    <el-cascader @change="getClassStatistics(1)" class="w250 selClass" v-model="searchForm.schoolYear" placeholder="请选择学年学期" :options="xnxqList" filterable :props="{expandTrigger:'hover'}" clearable></el-cascader>

                    <span class="filterTit ml30">状态：</span>
                    <el-select v-model="searchForm.status" @change="getClassStatistics(1)" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已发布" value="1"></el-option>
                        <el-option label="未发布" value="0"></el-option>
                    </el-select>

                </div>
                <div v-else>
                    <span class="filterTit">年级：</span>
                    <el-cascader class="w200 selClass" size="small" placeholder="选择班级" v-model="searchForm.classCode" @change="getClassHonorDetail()" :options="GradeClassList" filterable :props="{ children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>

                    <span class="filterTit ml30">荣誉：</span>
                    <!-- 自动发放 -->
                    <!-- <el-select v-if="honorType==1" @change="getClassHonorDetail()" v-model="searchForm.reward" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已获得" value="1"></el-option>
                        <el-option label="未获得" value="0"></el-option>
                    </el-select>       -->
                    <!-- 手动发放 -->
                    <el-select v-model="searchForm.reward" @change="getClassHonorDetail()" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in honorData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="m_GenTableBox">
                <div class="noSetting" v-if="honorType==0">
                    无荣誉项
                </div>
                <!-- <el-table class="tableBorder dimensionTable receivingTable" :data="tableData1" v-if="honorType==0">
                    <el-table-column key="1" label="排名" type="index">
                    </el-table-column>
                    <el-table-column key="2" label="班级" prop="className">
                    </el-table-column>
                    <el-table-column key="3" label="得分" prop="totalScore">
                    </el-table-column>
                    <el-table-column key="4" label="评价次数" prop="evaluationTimes" >
                    </el-table-column>
                </el-table> -->
                <div v-else>
                    <el-table class="tableBorder dimensionTable receivingTable" :data="tableData1" v-if="!detailFlg" v-loading="tableLoading">
                        <el-table-column label="学年" prop="xueNian">
                        </el-table-column>
                        <el-table-column label="学期" prop="xueQi">
                        <template slot-scope="scope">
                            {{scope.row.xueQi=='01'?'上学期':'下学期'}}
                        </template>
                        </el-table-column>
                        <el-table-column label="时间">
                            <template slot-scope="scope">
                                {{scope.row.week?scope.row.week:scope.row.month}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" prop="isPublish" >
                            <template slot-scope="scope">
                                <span :class="{'green':scope.row.isPublish,'red':!scope.row.isPublish}">{{scope.row.isPublish?'已发布':'未发布'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button @click="detailData = scope.row;detailFlg=true;getClassHonorDetail()" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-table class="tableBorder dimensionTable receivingTable" :data="tableData1" v-else>
                        <el-table-column label="班级" width="300" prop="className">
                        </el-table-column>
                        <el-table-column label="总分" width="200" prop="totalScore">
                        </el-table-column>
                        <el-table-column label="排名" width="200" prop="ranking">
                        </el-table-column>
                        <el-table-column label="荣誉" width="200" prop="honor">
                            <template slot-scope="scope">
                                <el-select v-if="honorType==2" v-model="scope.row.honorId" @change="release(scope.row)" placeholder="请选择" :disabled="detailData.currentCycle=='1'||scope.row.isPublish!==0"><!--当前周和已发放不允许操作-->
                                    <el-option
                                    v-for="item in honorData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-else>{{scope.row.honor}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="奖励">
                            <template slot-scope="scope">
                                <div v-if="scope.row.honor">
                                    <el-select :disabled="scope.row.isPublish!==0" v-model="scope.row.rewardType" clearable class="w150" @change="checkRelease(scope.row)" placeholder="请选择奖励类型"><!--当前周不允许操作-->
                                        <el-option label="分数" :value="1"></el-option>
                                        <el-option label="勋章" :value="2"></el-option>
                                    </el-select>
                                    <el-cascader :disabled="scope.row.isPublish!==0" :key="isResouceShow" v-model="scope.row.dimensionId" @change="checkRelease(scope.row)" class="w150" placeholder="请选择维度" :options="dimensionList" filterable :props="{value:'id', label:'name', children:'dimensionItemVOList', emitPath: false, checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
                                    <el-input :disabled="scope.row.isPublish!==0" v-model="scope.row.rewardNum" @blur="checkRelease(scope.row)" class="w100" maxlength="2" placeholder="请输入数值"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="margin-top: 20px" v-if="detailFlg">
                    <el-button @click="detailFlg=false;getClassStatistics(1);">返回</el-button>
                    <el-button type="primary" @click="publishReward(tableData1);" v-if="honorType==2">发布</el-button>
                </div>
            </div>

            <el-pagination v-if="honorType==0" class="pagination" background layout="prev, pager, next" :total="ruleItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination>

        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@/api/projectapp/qualityAppraisal';
import * as searchBarApi from '@/api/components/searchbar';
import * as evaluationApi from '@/api/projectapp/evaluationSetting';
export default {
    data(){
        return{
            detailFlg:false,
            xnxqList:[],            // 学年学期列表
            GradeClassList: [],     // 年级，班级列表
            dimensionList: [],
            curPage:1,              // 当前页码
            pageLimit:20,           // 每页限制记录条数
            ruleItemSum:0,          // 规则总条数
            tableLoading: false,    // 表格loading状态
            searchForm: {           // 搜索表格
                classCode: '',
                dimensionId: '',
                dateRange: '',
                schoolYear: '',
                status: '',
                reward: '',
            },
            tableData1:[],
            honorType: 0,           // 荣誉类型---- 0 无荣誉项 1自动发放荣誉 2手动发放荣誉
            isResouceShow:0,        // 放置报错
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        async init(){
            this.getXnXqList();
            this.honorType = await this.getSchoolSetting();
            console.log(this.honorType,"158")
            this.getClassStatistics();
            this.getDimensionList();
        },
        /**
         * 翻页采集规则列表
         * by:RayJ
         * time:2019-08-07
         */
        rulePageChange(curpage){
            this.curPage = curpage;
            this.getClassStatistics();
        },
        /**
         * 获取学年学期列表并组装成联机菜单
         * by:RayJ
         * time:2019-07-23
         */
        async getXnXqList(){
            var that = this;
            await Promise.all([
                searchBarApi.getxqList({xxdm:localStorage.getItem("xxdm")}),
                searchBarApi.getxnList({xxdm:localStorage.getItem("xxdm")}),
            ]).then(result => {
                that.xnxqList = $.extend(true,[],result[1]);
                for(var i=0;i<that.xnxqList.length;i++){
                    that.xnxqList[i].value = that.xnxqList[i].xn;
                    that.xnxqList[i].label = that.xnxqList[i].xn + "学年";
                    that.xnxqList[i].children = $.extend(true,[],result[0]);
                    for(var j=0;j<that.xnxqList[i].children.length;j++){
                        that.xnxqList[i].children[j].value = that.xnxqList[i].children[j].xq;
                        that.xnxqList[i].children[j].label = that.xnxqList[i].children[j].xqmc;
                    }
                }
            }).catch(error => {
                that.$notify({title:'错误',message:'数据初始化出错,刷新后再试',type:'error'});
            });
        },
        /**
         * 获取所有维度列表
         * by:RayJ
         * time:2019-07-24
         */
        async getDimensionList(){
            //如果维度列表里有值.就跳出不访问接口
            if(this.dimensionList.length>0){
                return
            }
            var res = await evaluationApi.getAllDimension();
            var arr = res.value
            this.checkDisable(arr);
            this.dimensionList = arr;
        },
        //根据hasMedal来检查是否可选
        checkDisable(arr){
            // ,disabled: 'hasMedal'
            for(var i of arr){
                i.disabled = !i.hasMedal;
                if(i.dimensionItemVOList&&i.dimensionItemVOList.length>0){
                this.checkDisable(i.dimensionItemVOList);
                }
            }
        },
        //获取学校荣誉设置
        async getSchoolSetting(){
            let res = await qualityApi.getClassHonorSetting();
            if(res.resultCode==1){
                return res.value.type?res.value.type:0;
            }else{
                return 1
            }
        },
        //获取班级评价统计
        getClassStatistics(page = this.curPage,limit = this.pageLimit){
            console.log(this.honorType,"this.honorType")
            this.detailFlg = false;
            if(this.honorType==0){
                var param = {
                    schoolCode: localStorage.getItem("xxdm"),
                    classCode: this.searchForm.classCode[1],
                    gradeCode: this.searchForm.classCode[0],
                    dimensionId: this.searchForm.dimensionId[0],
                    endTime: this.searchForm.dateRange?this.searchForm.dateRange[1]:'',
                    startTime: this.searchForm.dateRange?this.searchForm.dateRange[0]:'',
                    // keyWords: this.keyWords,
                    page,
                    limit,
                    // type: 1
                }
                qualityApi.classStatistics(param).then(res=>{
                    if(res.resultCode==1){
                        this.ruleItemSum = res.value.totalCount;
                        this.curPage = page;
                        this.tableData1 = res.value.dataList;
                        console.log(this.tableData1,"this.tableData1")
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            time: 1000
                        })
                    }

                })
            } else {
                this.tableLoading = true;
                this.getHonorList();
                var param = {
                    xueNian: this.searchForm.schoolYear?this.searchForm.schoolYear[0]:'',
                    xueQi: this.searchForm.schoolYear?this.searchForm.schoolYear[1]:'',
                    status: this.searchForm.status,
                }
                qualityApi.classHonor(param).then(res=>{
                    if(res.resultCode==1){
                        // this.ruleItemSum = res.value.totalCount;
                        // this.curPage = page;
                        this.tableData1 = res.value;
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.resultMessage,
                            time: 1000
                        })
                    }
                    this.tableLoading = false;
                })
            }
        },
        //获取全校所有班级荣誉项
        getHonorList(){
            console.log(this.honorType,"this.honorType")
            qualityApi.classHonorList({type:this.honorType}).then(res => {
                console.log(res,"获取全校所有班级荣誉项列表")
                this.honorData = res.value;
                this.honorData.forEach(e=>{e.id+=''})
            })
        },
        //筛选
        getClassHonorDetail(){
            ++this.isResouceShow
            this.detailFlg = true;
            if(this.searchForm.classCode==''&&this.searchForm.reward==''){//没筛选
                this.tableData1 = this.detailData.recordList;//直接显示
                return
            }
            this.tableData1 = _.filter(this.detailData.recordList, item => {
                let flg = (item.gradeCode == this.searchForm.classCode[0]||item.classCode == this.searchForm.classCode[1]) || (item.honorId == this.searchForm.reward)
                return flg;
            })
            console.log(this.tabledata1,410)
        },
                //手动选择荣誉
        release(row){
            var honor = this.honorData.find(e=>e.id==row.honorId)
            if(honor){
                row.honor = honor.name;
            }
            console.log(row,420)
            var param = {
                classCode: row.classCode,
                classHonor: row.honor,
                classHonorId: row.honorId,
                className: row.className,
                gradeCode: row.gradeCode,
                id: row.id,
                month: row.month,
                ranking: row.ranking,
                totalScore: row.addScore+row.cutScore,//每次发布荣誉重新计算总分
                weekId: this.detailData.weekId,
                xueNian: this.detailData.xueNian,
                xueQi: this.detailData.xueQi,
                year: row.year,
                cutScore: row.cutScore,
                dimensionId: row.dimensionId?row.dimensionId:null,
                rewardType: row.rewardType?row.rewardType:null,
                rewardNum: row.rewardNum?row.rewardNum:null
            }
            qualityApi.publishHonor(param).then(res=>{
                this.$notify({message:res.resultMessage,type:res.resultCode==1?'success':'error'});
                row.id = row.id?row.id:res.value;
            })
        },
        //判断是否可发奖励
        checkRelease(row){
            console.log(row,485);
            if(row.dimensionId == 'null'){
              row.dimensionId = null;
            }
            if(row.dimensionId&&row.rewardType&&row.rewardNum){
                var reg = /^[0-9]{1,2}$/;
                if(!reg.test(row.rewardNum)){
                    this.$notify({message:'奖励数量请输入0-99数字',type:'error'});
                }   
                else {
                    this.release(row);
                }
            } 
            // else if (!row.dimensionId&&!row.rewardType&&!row.rewardNum){
            //   this.release(row);
            // }
        },
        //确认发布荣誉
        publishReward(data){
            var canPublish= false;//是否能发
            var errmsg = '请至少选择一个荣誉';
            console.log(data,466)
            for(var d of data){
                if(d.honorId!=null){
                    if(d.dimensionId == 'null'){
                      d.dimensionId = null;
                    }
                    if(!d.rewardType&&!d.dimensionId&&!d.rewardNum){
                      canPublish = true;
                      //break;
                    } else if((!d.rewardType||!d.dimensionId||!d.rewardNum)&&!d.isPublish){
                      errmsg = "请填写完整奖励";
                      canPublish = false;
                      break;
                    } else {
                      canPublish = true;
                      //break;
                    }
                }
            }
            if(canPublish){
                var param = {
                    xxdm: localStorage.getItem("xxdm"),
                    isPublish: 1
                }
                if(this.detailData.weekId){//按周发放
                    this.$set(param,'weekId',this.detailData.weekId);
                } else {//按月发放
                    this.$set(param,'year',this.detailData.recordList[0].year);
                    this.$set(param,'month',this.detailData.recordList[0].month);
                }
                qualityApi.publishReward(param).then(res => {
                    this.$notify({message:res.resultMessage,type:res.resultCode==1?'success':'error'});
                    this.detailFlg=false;
                    this.getClassStatistics(1);
                })
            } else {
                console.log(this.detailData)
                this.$notify({message:errmsg,type:'error'});
            }
        },
    }
}
</script>

<style scoped lang="scss">
.sliderLeft-enter-active {
    animation-name: fadeInLeft;
    animation-duration: .5s;
}

.sliderLeft-leave-active {
    animation-name: fadeOutLeft;
    animation-duration: .5s;
}
.w100{
    width: 100px;
}
.w150{
    width: 150px;
}
.w200{
    width: 200px;
}
.w250{
    width: 250px;
}
.w300{
    width: 300px;
}
.fl{
    float: left;
}
.ml30{
    margin-left: 30px;
}
.filterTit{
    font-weight: 700;
    font-size: 14px;
    color: #666;
}
.filter-container.innerTab{
    line-height: 0px;
    padding: 0 20px;
    padding-bottom: 15px;
    min-height: auto;
}
.filterPopBox{
    padding:5px;
    .filterCol{
        width: 100%;
        position: relative;
        padding: 5px 0;
        padding-left: 70px;
        .filterTit{
            position: absolute;
            width:60px;
            left: 0;
            height: 32px;
            line-height: 32px;
            text-align: right;
        }
    }
}
.goodsType{
    width: 350px;
    float: left;
    margin-right: 20px;
}
.dimensionTable{

    /deep/ .inline{
        display: inline;
    }
    /deep/ .cell{
        line-height: 28px;
    }
    .dimensionImg{
        width: 40px;
        height: 40px;
        display: inline-block;
        float: left;
        margin-right: 4px;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .opacity{
            opacity: 0.5;
        }
        .noHave{
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: auto;
            margin-left: -20px;
            margin-top: -10px;
        }
    }
}
.dataPicker{
    /deep/ .el-range-separator{
        padding: 0;
    }
}
.dimensionTable .green{
    font-weight: 700;
    color: #208900;
    line-height: 40px;
}
.dimensionTable .red{
    font-weight: 700;
    color: #ff334b;
    line-height: 40px;
}

</style>
