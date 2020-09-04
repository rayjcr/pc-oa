<template>
    <div class="app-container">
        <div class="u-cardMain flex">
            <div class="flex_1">
                <h1>{{qualityname}}</h1>
                <div class="flex totilCon">
                    <span>应参与人数：{{taskStatistics.participants}}</span>
                    <span>实际参与人数：{{taskStatistics.actualParticipants}}</span>
                    <span>总完成人数：{{taskStatistics.totalComplete}}</span>
                </div>
            </div>
            <div class="percent flex">
                <div class="part">
                    <div class="name">参与度</div>
                    <strong>{{taskStatistics.percentParticipate}}%</strong>
                </div>
                <div class="part">
                    <div class="name">完成度</div>
                    <strong>{{taskStatistics.percentComplete}}%</strong>
                </div>
            </div>
        </div>
        <div class="u-conMain">
            <el-tabs class="u_TableMain block ofhide" :class="{'mini':rightLayer}" v-model="curTab" @tab-click="getCurTabData" type="border-card">
                <el-tab-pane name="1" label="按班级">
                    <div class="filter-container innerTab">
                        <span class="filterTit">班级：</span>
                        <el-cascader class="w200" size="small" placeholder="选择班级" v-model="searchClassCode" @change="getStatistics" :options="GradeClassList" :props="{ children:'bjList'}" clearable></el-cascader>
                    </div>
                    <div class="m_GenTableBox">
                        <el-table class="tableBorder" ref="singleTable" highlight-current-row height="400px" :data="tableData" @row-click="clickRow">
                            <el-table-column key="1" label="班级名称" prop="className"></el-table-column>
                            <el-table-column key="2" label="所在年级" prop="gradeName" v-if="!rightLayer"></el-table-column>
                            <el-table-column key="3" label="参与度">
                                <template slot-scope="scope">
                                    <span>{{scope.row.actualParticipants+"/"+scope.row.totalCount}}</span>{{!rightLayer?("( "+scope.row.percentParticipate+"% )") :""}}
                                </template>
                            </el-table-column>
                            <el-table-column key="4" label="完成度">
                                <template slot-scope="scope">
                                    <span>{{scope.row.totalComplete+"/"+scope.row.totalCount}}</span>{{!rightLayer?("( "+scope.row.percentComplete+"% )"):""}}
                                </template>
                            </el-table-column>
                            <el-table-column key="5" label="操作" v-if="!rightLayer">
                                <template slot-scope="scope">
                                    <el-button @click.stop="getDetail(scope.row)" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="2" label="按任务">
                    <div class="m_GenTableBox">
                        <el-table class="tableBorder" ref="singleTable" highlight-current-row height="400px" :data="tableData" @row-click="clickRow">
                            <el-table-column label="子任务名称" prop="subTaskName"></el-table-column>
                            <el-table-column label="参与度">
                                <template slot-scope="scope">
                                    <span>{{scope.row.actualParticipants+"/"+scope.row.totalCount}}</span>{{!rightLayer?("( "+scope.row.percentParticipate +"% )") :""}}
                                </template>
                            </el-table-column>
                            <el-table-column label="完成度">
                                <template slot-scope="scope">
                                    <span>{{scope.row.totalComplete+"/"+scope.row.totalCount}}</span>{{!rightLayer?("( "+scope.row.percentComplete+"% )"):""}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" v-if="!rightLayer">
                                <template slot-scope="scope">
                                    <el-button @click.stop="getDetail(scope.row)" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    
                </el-tab-pane>
                <el-button type="primary" @click="backList">返回</el-button>
            </el-tabs>
            <!-- 从右侧弹出的弹框 -->
            <transition name="sliderRight" v-on:beforeEnter="mystyle=''" v-on:afterEnter="mystyle='position:relative'">
                <div class="rightLayer" :style="mystyle" v-if="rightLayer">
                    <div class="u_TableMain">
                        <div class="m_tit flex">
                            <div class="tit flex_1">{{curTab == '1'?curData.className:curData.subTaskName}}</div>
                            <span>搜索：</span>
                            <el-input v-if="curTab == '1'" size="small" class="w200" @input="handleChange" placeholder="请输入搜索内容" v-model="keyword" clearable></el-input>
                            <el-cascader v-if="curTab == '2'" size="small" class="w200" placeholder="选择班级" v-model="classIds" @change="handleChange" :options="GradeClassList" :props="{ children:'bjList'}" clearable></el-cascader>
                        </div>
                        <div class="m_GenTableBox">
                            <el-table class="tableBorder" height="470px" :data="infoDetail" v-if="curTab == '1'">
                                <el-table-column label="学生姓名" prop="studentName"></el-table-column>
                                <el-table-column label="参与任务">
                                    <template slot-scope="scope">
                                        <div v-for="(sitem,sindex) in scope.row.subTaskNames" class="taskItem">{{sitem}},</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="完成度" prop="" :formatter="stateFormat"></el-table-column>
                            </el-table>
                            <el-table class="tableBorder" height="470px" :data="infoDetail" v-if="curTab == '2'">
                                <el-table-column label="班级名称" prop="className"></el-table-column>
                                <el-table-column label="所在年级" prop="gradeName"></el-table-column>
                                <el-table-column label="参与度">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.actualParticipants+"/"+scope.row.totalCount}}</span>{{"( "+scope.row.percentParticipate +"% )"}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="完成度">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.totalComplete+"/"+scope.row.totalCount}}</span>{{"( "+scope.row.percentComplete+"% )"}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="m_optbox">
                                <el-button type="primary" size="small" @click="rightLayer=false">关闭</el-button>
                            </div>
                        </div>
                    </div>    
                </div>
            </transition>
        </div>
    </div>
</template>

<script>     
import * as api from '@/api/projectapp/qualityAppraisal'
import * as baseXnxqApi from '@/api/admin/division';
import * as baseClassApi from '@/api/admin/class';
export default {
	name: 'statistics',
	data() {
        return{
            xxdm: localStorage.getItem("xxdm"),
            categoryId:'',
            qualityname: localStorage.getItem("qualityname"),
            taskStatistics:{},                  //主任务统计
            curTab:'1',                                     //当前选择的tab
            GradeClassList:[],
            searchClassCode:[],
            tableData:[],
            mystyle: '',//右侧弹框样式
            rightLayer: false,
            infoDetail:[],
            curData:{},
            keyword:"",
            classIds:[],
        }
    },
    created() {
		this.init()
	},
	methods:{
        init(){
            this.categoryId = this.$route.query.categoryId;
            this.primaryStatistics()
            this.getAllGradeClass()
            this.getStatistics()
        },
        // 主任务统计
        async primaryStatistics(){
            var data = {
                id: this.categoryId,
            }
            var res = await api.primaryStatistics(data)
            this.taskStatistics = res.value?res.value:{}
        },
        // 获取年级班级信息做一个级联菜单
        async getAllGradeClass(){
            var xnxqObj = await baseXnxqApi.Getxndm({xxdm:this.xxdm})
            var res = await baseClassApi.GetNjBjList({xxdm:this.xxdm,xndm:xnxqObj.data.xn});
            var resList = res.data?res.data:[];
            resList.forEach(item => {
                item.label = item.njmc
                item.value = item.njdm
                if(item.bjList && item.bjList.length > 0){
                    item.bjList.forEach(bj => {
                        bj.label = bj.bj
                        bj.value = bj.uuid
                    })
                }
            })
            this.GradeClassList = resList
        },
        // 统计
        async getStatistics(){
            this.tableData = []
            var data = {
                id: this.categoryId,
            }
            if(this.curTab=='1'){
                data.classIds = this.searchClassCode.length>0?this.searchClassCode[1]:""
                var res = await api.rewardCassStatistics(data)
            }else var res = await api.taskStatistics(data)
            this.tableData = res.value?res.value:[]
        },
        
        // 查看
        async getDetail(row){
            if(row){
                this.rightLayer = true
                this.curData = row
                this.keyword =""
                this.classIds=[]
                this.$refs.singleTable.setCurrentRow(row);
            }
            if(this.curTab=='1'){
                var data = {
                    id: this.categoryId,
                    classId:  this.curData.classId,
                    keyword: this.keyword
                }
                var res = await api.rewardClassStatisticsDetail(data)
            }else{
                var data = {
                    id: this.curData.subTaskId,
                    classIds: this.classIds.length>0?this.classIds[1]:""
                }
                var res = await api.taskStatisticsDetail(data)
            }
            
            this.infoDetail = res.value?res.value:[]
        },
        handleChange(){
            // console.log("444")
            this.getDetail()
        },
        clickRow(row){
            if(this.rightLayer) this.getDetail(row)
        },
        
        stateFormat (row, column) {
            if (row.percentComplete>-1) {
                return row.percentComplete+"%"
            } else if(row.percentComplete==-1){
                return "无任务"
            } else {
                return "--"
            }
        },
        //获取当前tab底下的数据
        getCurTabData(){
            this.rightLayer = false
            this.getStatistics()
        },
        // 返回列表页
        backList(){
            window.sessionStorage.setItem('tabpan',JSON.stringify({tabpan:3}))
            this.$router.push({path:'/qualityAppraisal/appraisalSetting'})
        },
    }
}
</script>

<style scoped lang="scss"> 
.u-cardMain{
    h1{
        font-weight: bold;
        margin: 10px 0;
    }
    .totilCon{
        flex-wrap: wrap;
        span{
            width: 50%;
            padding: 5px 0;
        }
    }
    .percent{
        align-content: center;
        justify-content: center;
        align-items: center;
        .part{
            width: 200px;
            .name{
                font-size: 18px;
            }   
            strong{
                font-size: 50px;
            }
        }
    }
}
.m_GenTableBox{
    .cell>span{
        min-width: 40px;
        display: inline-block;
    }
}
.u-conMain{
    position: relative;
}
.u_TableMain.mini{
    width: 50%;
    float: left;
    overflow-x: auto;
    .dimensionTable{
        width: 100%;
        min-width: auto;
    }
}
.rightLayer{
    display: inline-block;
    width: 50%;
    padding-left: 20px;
    position: absolute;
    top:0;
    .m_tit{
        font-size: 14px;
        color:#666;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        border-bottom: 1px dotted #d8d8d8;
        .tit {
            font-family: 'fz';
            font-size: 16px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        /deep/ .el-cascader--small{
            line-height: 40px;
        }
    }
    .m_optbox{
        text-align: right;
        margin-top: 10px;
    }
    .taskItem{
        line-height: 25px;
    }
}
</style>