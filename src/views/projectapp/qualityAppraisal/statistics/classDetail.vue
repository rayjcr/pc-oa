<template>
    <div class="app-container calendar-list-container">
        <div class="u_TableMain block ofhide">
            <div class="classDetailHead">
                <div class="tit"><span class="classname">{{curClassInfo.className}}</span> 
                <span class="classmaster">班主任：{{classTeacher}}</span>
                </div>
                <div class="infoDetail">
                    <span>班级被评价: <b>{{curClassInfo.evaluationTimes}}</b> 次</span>
                    <span>学生被评价: <b>{{curClassInfo.studentTimes}}</b> 次</span>
                </div>
                <div class="infoHistroy">
                    历史荣誉: <span v-html="honorStr"></span>
                </div>
            </div>

            <div class="classDetailBody">
                <el-tabs class="classTabsBox block ofhide" :before-leave="clickTab" v-model="curTab"  type="border-card">
                    <el-tab-pane name="1">
                        <span slot="label">评价记录</span>
                        <div class="filter-container innerTab">
                            <!-- <div class="filterCol">
                                <span class="filterTit">类型：</span>
                                <el-select class="w150" size="small" v-model="searchForm.pjType">
                                    <el-option v-for="(item,index) in pjTypeList" :label="item.label" :value="item.value" :key="index"></el-option>
                                </el-select>
                            </div> -->
                            <div class="filterCol">
                                <span class="filterTit">时间：</span>
                                <el-date-picker v-model="searchForm.dateTimeArea" size="small" class="dataPicker w200" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getEvaluationRecordList(true)"> </el-date-picker>
                            </div>
                            <el-button slot="reference" type="primary" size="small" icon="el-icon-upload2" @click="exportEx(1)">导出</el-button>
                        </div>
                        <div class="m_GenTableBox">
                            <el-table class="tableBorder" :data="RecordList">
                                <el-table-column label="评价时间" prop="recordTime">
                                </el-table-column>
                                <el-table-column label="评价人" prop="evaluatorName">
                                </el-table-column>
                                <el-table-column label="评价类型">
                                    <template slot-scope="scope">
                                        <!-- {{backEvaluationTypeName(scope.row.type)}} -->
                                        教师评价
                                    </template>
                                </el-table-column>
                                <el-table-column label="评价项" prop="evaluationName">
                                </el-table-column>
                                <el-table-column label="奖惩">
                                    <template slot-scope="scope">
                                        {{backRewardTypeName(scope.row)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="评语">
                                    <template slot-scope="scope">
                                        <span class="remark" v-html="scope.row.remark?scope.row.remark:'<em>未填写评语</em>'"></span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                    </el-tab-pane>

                    <el-tab-pane name="2">
                        <span slot="label">荣誉记录</span>
                        <div class="filter-container innerTab">
                            <div class="filterCol">
                                <span class="filterTit">学年学期：</span>
                                <el-cascader v-model="searchForm.xnxq" size="small" class="w200 selClass" placeholder="请选择学年学期" :options="xnxqList" filterable :props="{expandTrigger:'hover'}" @change="getClassEvaluationList(true)"></el-cascader>
                            </div>
                            <el-button slot="reference" type="primary" size="small" icon="el-icon-upload2" @click="exportEx(2)">导出</el-button>
                        </div>
                        <div class="m_GenTableBox">
                            <el-table class="tableBorder" :data="RecordList">
                                <el-table-column label="学年" prop="xueNian">
                                </el-table-column>
                                <el-table-column label="学期">
                                    <template slot-scope="scope">
                                        {{scope.row.xueQi=='01'?'上学期':'下学期'}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="时间" prop="createTime">
                                </el-table-column>
                                <el-table-column label="荣誉" prop="honor">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="3">
                        <span slot="label">任务记录</span>
                        <div class="filter-container innerTab">
                            <div class="filterCol">
                                <span class="filterTit">学年学期：</span>
                                <el-cascader v-model="searchForm.xnxq" size="small" class="w200 selClass" placeholder="请选择学年学期" :options="xnxqList" filterable :props="{expandTrigger:'hover'}" clearable></el-cascader>
                            </div>
                            <div class="filterCol">
                                <span class="filterTit">类型：</span>
                                <el-select class="w150" size="small" v-model="searchForm.taskType" @change="getTaskList(true)">
                                    <el-option v-for="(item,index) in taskTypeList" :label="item.label" :value="item.value" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="m_GenTableBox" :class="{'mini':showMiniTask}">
                            <el-table class="tableBorder" :data="RecordList">
                                <el-table-column label="任务名称" prop="name">
                                </el-table-column>
                                <el-table-column label="类型">
                                    <template slot-scope="scope">
                                        {{backTaskTypeName(searchForm.taskType)}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="有效期" prop="endTime">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <span class="check" @click="checkTask(scope.row)">查看</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- <div class="" @click="checkTaskList">悬赏任务查看</div>
                            <div class="" @click="checkTaskList">常规任务查看</div>
                            <div class="" @click="checkTaskList">考勤任务查看</div> -->
                        </div>
                        <div class="m_GenTableBox" :class="{'mini':showMiniTask}" v-show="showMiniTask">
                            <!--taskType=1 常规任务-->
                            <el-table class="tableBorder" :data="taskDetailList" v-if="searchForm.taskType==1">
                                <el-table-column label="学生" prop="name">
                                </el-table-column>
                                <el-table-column label="提交时间" prop="createTime">
                                </el-table-column>
                                <el-table-column label="状态">
                                    <template slot-scope="scope">
                                        {{scope.row.status==0?'待审核':(scope.row.status==1?'通过':'不通过')}}
                                    </template>       
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">


                                        <el-popover
                                        placement="right"
                                        width="326"
                                        trigger="click">
                                        <div>{{scope.row.content }}</div>
                                        <div class="taskImgList">
                                            <div class="taskImgBox" v-for="(item,index) in scope.row.fileInfoVOS">
                                                <img :src="item.absolutePath">
                                            </div>
                                        </div>
                                        <el-button slot="reference" type="primary" size="mini">查看</el-button>
                                        </el-popover>

                                        <span class="check"></span>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <!--taskType=2 考勤任务-->


                            <!--taskType=3 悬赏任务-->
                            <el-table class="tableBorder" :data="taskDetailList" v-if="searchForm.taskType==3">
                                <el-table-column label="子任务" prop="name">
                                </el-table-column>
                                <el-table-column label="维度" prop="dimensionName">
                                </el-table-column>
                                <el-table-column label="有效期" prop="endTime">
                                </el-table-column>
                                <el-table-column label="完成/参与人数" align="center">
                                    <template slot-scope="scope">
                                        <div v-if='!scope.row.totalCount||scope.row.totalCount==0'>暂无人参与</div>
                                        <div v-else>
                                            {{scope.row.totalComplete}}/{{scope.row.totalCount}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-popover
                                        placement="right"
                                        width="500"
                                        trigger="click">
                                            <div>
                                                <el-table :data="classDetailList">
                                                    <el-table-column label="领取人" prop="name">
                                                    </el-table-column>
                                                    <el-table-column label="协作人">
                                                        <template slot-scope="scope">
                                                            <div v-if="scope.row.collaborators">
                                                                <span v-for="(sitem,sindex) in scope.row.collaborators">{{sitem.name}},</span>
                                                            </div>
                                                            <div v-else>--</div>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="状态">
                                                        <template slot-scope="scope">
                                                            {{scope.row.status==0?'待审核':(scope.row.status==1?'通过':'不通过')}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="操作">
                                                        <template slot-scope="scope">
                                                            <span class="check" @click="showDetailSubmit(scope.row)">查看</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                        <!-- <div>{{scope.row.content }}</div>
                                        <div class="taskImgList">
                                            <div class="taskImgBox" v-for="(item,index) in scope.row.fileInfoVOS">
                                                <img :src="item.absolutePath">
                                            </div>
                                        </div> -->
                                        <el-button slot="reference" type="primary" size="mini" @click="getClassEvaluationDetail(scope.row)">查看</el-button>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                            </el-table>



                            <el-button class="mt10 fr" type="primary" size="small" @click="showMiniTask=false">关闭</el-button>
                        </div>

                    </el-tab-pane>

                    <div class="plr15 cb" v-if="curTab!='2'">
                        <el-pagination class="pagination" background layout="prev, pager, next" :total="recordTotal" :page-size="limitSize" :current-page="curPage" @current-change="pageChange"></el-pagination>
                    </div>

                </el-tabs>
            </div>
        </div>

        <el-dialog title="提交内容" :visible.sync="detailVisible" :close-on-click-modal='false'>
            <div class="detailMain" v-if="subTaskDetail.evaluationRuleFrequency">
                <!-- {{cycleName[subTaskDetail.evaluationRuleFrequency.type]}} -->
                <div class="" v-for="(detail,index) in userDetailList">  
                    <div class="timeHead" v-if="subTaskDetail.evaluationRuleFrequency.type!=1" >{{detail[0][cycleName[subTaskDetail.evaluationRuleFrequency.type]]}}</div>

                    <ul class="completionStatus">
                        <li class="item alignCenter" v-for="(iteminfo,n1) in detail">
                            <div class="date">{{iteminfo.createTime}} <span>{{iteminfo.name?(iteminfo.name+'提交'):''}}</span>
                            <div class="status" :class="{'pass':iteminfo.status>=1}" v-if="iteminfo.status!=0">{{(iteminfo.status==-1)?'不通过':'通过'}}</div>


                            <el-popover
                            placement="top"
                            width="250"
                            v-model="isAudit" v-else>
                            <div class="auditBox">
                                <div class="center">审核</div>
                                <div class="">
                                    <el-radio v-model="curAudit" label="1">通过</el-radio>
                                    <el-radio v-model="curAudit" label="-1">不通过</el-radio>
                                </div>
                                <textarea class="reasonBox" v-model="auditReason" v-if="curAudit=='-1'"></textarea>
                            </div>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="isAudit = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="auditSubmit(iteminfo)">确定</el-button>
                            </div>
                            <el-button slot="reference" class="fr" type="primary" size="mini">审核</el-button>
                            </el-popover>



                            <!-- <el-button v-else type="primary" size="mini" class="fr">审核</el-button> -->
                            </div>

                            <div class="overview">
                            <p class="previewText text-overflow-clamp2">
                                {{iteminfo.content}}
                            </p>
                                <div class="medialist flex alignCenter justifySpaceBetween" v-if="iteminfo.fileInfoVOS.length>0">
                                    <div class="media" v-for="imgInd in 3">
                                    <div class="playerBtn" v-if="iteminfo.fileInfoVOS.length>=imgInd&&iteminfo.fileInfoVOS[imgInd-1].contentType.indexOf('video')>=0" >
                                        <video 
                                        ref="myVideo" 
                                        :controls="false"                       
                                        :src="iteminfo.fileInfoVOS[imgInd-1].absolutePath">
                                        </video>                    
                                    </div>
                                    <img v-gallery="'smallimg'+n1" v-else-if="iteminfo.fileInfoVOS.length>=imgInd" :src="iteminfo.fileInfoVOS[imgInd-1].absolutePath" alt="">
                                    </div>
                                </div>
                                <div class="link flex alignCenter" v-if="iteminfo.linkUrl">
                                    <div class="linkicon"></div>
                                    <div class="linktitle flex_1 text-overflow-clamp2">{{iteminfo.linkTitle}}</div>
                                    <div class="openlink" @click="openLink(iteminfo.linkUrl)">打开链接</div>
                                </div>
                            </div>
                            
                            <!-- <div class="more" @click="showCompitionDetails(iteminfo)" v-if="iteminfo.status!=-1">查看详情</div>
                            <div class="resubmit" @click="reSubmit(iteminfo)" v-if="iteminfo.status==-1">重新提交</div> -->
                        </li>
                    </ul>

                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import _ from 'lodash';
import {getTeacherInfoByZgh} from '@/api/admin/teach'
import * as api from '@/api/ksgl/kswh/index'
import * as qualityApi from '@/api/projectapp/qualityAppraisal';
import * as evaluationApi from '@/api/projectapp/evaluationSetting';
import * as searchBarApi from '@/api/components/searchbar';
export default {
    data() {
        return {
            curTab:"1",
            xnxqList:[],                // 学年学期列表
            showMiniTask:false,         // 显示悬赏，常规，考勤任务
            classCode:'',               // 班级code
            searchForm:{pjType:'',dateTimeArea:[],xnxq:[],taskType:2,},    // 搜索条件form
            pjTypeList:[{value:1,label:'学生评价'},{value:2,label:'教师评价'}],
            RecordList:[],        // 评价记录列表
            tempHonorList:[],           // 荣誉列表暂存

            taskTypeList:[{value:3,label:'悬赏任务'},{value:1,label:'常规任务'},{value:2,label:'考勤打卡'}],    // 任务类型列表
            curClassInfo:{},            // 当前班级对象
            recordTotal:0,              // 总记录条数
            limitSize:10,               // 每页几条记录
            curPage:1,                  // 当前页码

            subTaskType:0,              // 当前主任务类型
            taskDetailList:[],          // 主任务下的列表
            taskRecordTotal:0,
            taskcurPage:1,

            classDetailList:[],         // 悬赏任务班级内详情
            userDetailList:[],          // 用户提交记录详情
            subTaskDetail:{},           // 悬赏任务子任务详情
            detailVisible:false,        // 详情弹层
            cycleName:{
                '1': 'day',
                '2': 'day',
                '3': 'weekTab',
                '4': 'monthTab'
            },
            curAudit:'1',
            isAudit:false,
            auditReason:'',
            curXn:'',
            curXq:'',
            honorStr:'',
            classTeacher:'',
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        async init(){
            this.classCode = this.$route.query.classCode;
            console.log(this.classCode,"班级code");
            this.curClassInfo = JSON.parse(window.sessionStorage.getItem('curClassEvaluation'));
            let res = await api.dqxnxqObj({xxdm: window.localStorage.getItem("xxdm")})
            console.log(res,"当前学年学期")
            this.curXn = res.data.xn;
            this.curXq = res.data.xq;
            this.searchForm.xnxq = [this.curXn,this.curXq]

            // 获取班主任名字 curClassInfo只提供了职工号
            let teacherInfo = await getTeacherInfoByZgh({xxdm:window.localStorage.getItem('xxdm'),zgh:this.curClassInfo.classTeacher});
            this.classTeacher = teacherInfo.data.name;
            // console.log(teacherInfo,"teacherInfo")

            this.getXnXqList();
            this.getRecordList();
            this.getClassEvaluationList();

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
        getRecordList(){
            if(this.curTab=='1'){
                this.getEvaluationRecordList();
            }
            if(this.curTab=='2'){
                // this.getHonorList();
                this.RecordList = this.tempHonorList;
            }
            if(this.curTab=='3'){
                this.getTaskList();
            }
        },
        /**
         * 切换标签卡事件
         */
        clickTab(active,old){
            this.searchForm = {pjType:'',dateTimeArea:[],xnxq:[],taskType:2};
            this.curTab = active;
            this.curPage = 1;
            this.getRecordList();
            // console.log(tabIndex,"切页咯")
        },
        /**
         * 获取评价记录
         */
        async getEvaluationRecordList(isInitPage){
            if(isInitPage){
                this.curPage = 1;
            }
            let params = {};
            params.page = this.curPage;
            params.limit = this.limitSize;
            if(this.searchForm.dateTimeArea&&this.searchForm.dateTimeArea.length>1){
                params.startTime = this.searchForm.dateTimeArea[0].replace(/-/g, "/");
                params.endTime = this.searchForm.dateTimeArea[1].replace(/-/g, "/");
            }
            let res = await evaluationApi.getEvaluationRecordList(params)
            this.RecordList = res.value.dataList;
            this.recordTotal = res.value.totalCount;
        },
        /**
         * 获取班级荣誉记录
         */
        async getClassEvaluationList(isInitPage){
            // if(isInitPage){
            //     this.curPage = 1;
            // }
            let params = {};
            params.schoolYear = this.searchForm.xnxq[0]||this.curXn;
            params.term = this.searchForm.xnxq[1]||this.curXq;
            params.schoolCode = window.localStorage.getItem('xxdm');
            params.classCode = this.classCode;
            let res = await qualityApi.getClassHonor(params);
            this.tempHonorList = res.value;

            let honorList = this.tempHonorList.map(({honor})=>honor)
            let onlyHonor = [...new Set(honorList)];
            this.honorStr = "";
            for(let i=0;i<onlyHonor.length;i++){
                this.honorStr += onlyHonor[i] + "*" + "<b>" + _.filter(this.tempHonorList,{'honor':onlyHonor[i]}).length +"</b>"
            }
            this.getRecordList();
        },
        
        /**
         * 获取任务记录列表 curTab = 3
         */
        async getTaskList(isInitPage){
            this.RecordList = [];
            if(isInitPage){
                this.curPage = 1;
            }
            let params = {};
            params.page = this.curPage;
            params.limit = this.limitSize;
            params.classCode = this.classCode;
            // taskType:3 获取悬赏任务列表 其余获取打卡任务 和 普通任务
            if(this.searchForm.taskType==3){
                let res = await evaluationApi.getEvaluationItemCategory(params);
                this.RecordList = res.value.dataList;
                this.recordTotal = res.value.totalCount;
                console.log(res,'悬赏任务列表res')
            }else{
                params.taskType = this.searchForm.taskType;
                let res = await evaluationApi.getEvaluationByPage(params)
                this.RecordList = res.value.dataList;
                this.recordTotal = res.value.totalCount;
                console.log(res,"任务TaskList")
            } 
        },

        /**
         * 获取子任务详细信息 by 班级
         */
        async getClassEvaluationDetail(item){
            console.log(item,"item,387")
            this.subTaskDetail = item;
            let params = {};
            params.classCode = this.classCode;
            params.dimensionId = item.dimensionId;
            params.evaluationId = item.id;
            params.limit = 200;
            params.page = 1;
            params.status = "0,1,-1";
            params.schoolCode = window.localStorage.getItem("xxdm");
            let res = await evaluationApi.getClassDetailByTask(params);
            this.classDetailList = res.value.dataList;
            console.log(res,"返回当前子任务的班级内学生情况")
        },

        async showDetailSubmit(item){
            let type = this.subTaskDetail.evaluationRuleFrequency.type;
            let groupKeyWord = type == 2?'day':type==4?'monthTab':type==3?'weekTab':''
            this.userDetailList = this.indexGroupBy(item.itemInfoList, groupKeyWord);
            this.detailVisible = true;
        },

        /**
         * 查看主任务内的详情
         */
        async checkTask(item){
            console.log(item,"任务详情")
            this.subTaskType = item.taskType;
            this.showMiniTask = true;
            let params = {};
            params.classCode = this.classCode;
            params.evaluationId = item.id;
            params.limit = 10;
            params.page = 1;

            // 如果是悬赏任务就显示子任务列表
            if(this.searchForm.taskType==3){
                params.categoryId = item.id;
                params.id = item.id;
                let res = await evaluationApi.getEvaluationItemSubCategory(params);
                let resStatistics = await qualityApi.taskStatistics(params);
                // console.log(res,resStatistics,"2份res")

                this.taskDetailList = this.completionTaskInfo(res.value,resStatistics.value);
                console.log(this.taskDetailList,"最终的列表显示")
                this.taskRecordTotal = 0;
            }else{
                let res = await qualityApi.evaluationRecodeList(params);
                this.taskDetailList = res.value.dataList;
                this.taskRecordTotal = res.value.totalCount;
                console.log(res,"任务提交情况")
            }
        },

        pageChange(curpage){
            this.curPage = curpage;
            this.getRecordList();
        },

        /**
         * 补全悬赏任务返回的对象
         * getEvaluationItemSubCategory 只返回基本信息没有统计相关
         * taskStatistics 只返回统计相关
         * 相关属性转移
         * totalComplete: 
         * totalCount: 
         */
        completionTaskInfo(mainRes,subRes){
            for(let i=0;i<mainRes.length;i++){
                mainRes[i].totalComplete = _.find(subRes,{'subTaskId':mainRes[i].id}).totalComplete;
                mainRes[i].totalCount = _.find(subRes,{'subTaskId':mainRes[i].id}).totalCount;
            }
            return mainRes;
        },
        openLink(link){
            window.open(link, '_blank');
        },
        /**
         * 查看用户提交
         */
        checkSubmit(item){
            console.log(item,'任务详细信息')
        },

        /**
         * 提交审核
         */
        async auditSubmit(item){
            console.log(item,"审核");
            var params = {
                remark: this.auditReason,
                recordItemId:item.id,
                status: this.curAudit
            }
            if(params.status=='-1'&&params.remark.length<2){
                this.$notify({title:'警告',message:'请填写2-200字不通过说明',type:'warning'});
                return
            }
            var res = await evaluationApi.auditSubmit(params);
            if(res.resultCode == 1){
                this.$notify({title:'成功',message:'审核成功',type:'success'});
                this.detailVisible = false;
                this.isAudit = false;
                this.curAudit = "1";
                this.auditReason = "";
            }
        },
        /**
         * 返回评价项类型
         */
        backEvaluationTypeName(type){
            switch(type) {
                case 1:
                    return '录入型'
                    break;
                case 2:
                    return '项目型'
                    break;
                case 3:
                    return '学生上传'
                    break;
                case 4:
                    return '评价团体'
                    break;
                case 5:
                    return '班级荣誉奖励'
                    break;
                default:
                    return '--'
            } 
        },
        /**
         * 返回奖惩类型
         */
        backRewardTypeName(item){
            switch(parseInt(item.rewardType)) {
                case 3:
                    return '+' + item.score + '分'
                    break;
                case 4:
                    return item.score + '分'
                    break;
                case 5:
                    return '+' + item.medal + '勋章'
                    break;
                case 6:
                    return item.medal + '勋章'
                    break;
                default:
                    return '--'
            } 
        },
        /**
         * 返回任务类型字符串
         */
        backTaskTypeName(type){
            switch(parseInt(type)) {
                case 1:
                    return '常规任务'
                    break;
                case 2:
                    return  '考勤打卡'
                    break;
                case 3:
                    return '悬赏任务'
                    break;
                default:
                    return '--'
            } 
        },
        /**
         * 分组
         */
        indexGroupBy(arr,key){
            var res = [];
            if(key==''){
            res[0] = []
            }
            arr.forEach(e=>{
            if(key==''){
                res[0].push(e);
            } else {
                var ind = res.findIndex(r=>{
                if(key!='dayTab'){
                    return r[0][key]==e[key]
                } else {
                return r[0][key].split(' ')[0] == e[key].split(' ')[0]; 
                }            
                });
                if(ind<0){
                res.push([e]);
                } else {
                res[ind].push(e);
                }            
            }

            })
            return res;
        },
        async exportEx(type){
            console.log(this.searchForm,"this.searchForm")
            let res;
            if(type==1){
                let params = {};
                params.schoolCode = window.localStorage.getItem('xxdm');
                params.startTime = this.searchForm.dateTimeArea[0];
                params.endTime = this.searchForm.dateTimeArea[1];
                params.classCode = this.curClassInfo.classCode;
                params.gradeCode = this.curClassInfo.gradeCode;
                res = await qualityApi.exportRecordExl(params);
            }else if(type==2){
                let params = {};
                params.schoolCode = window.localStorage.getItem('xxdm');
                params.schoolYear = this.searchForm.xnxq[0] || '';
                params.term = this.searchForm.xnxq[1] || '';
                params.classCode = this.curClassInfo.classCode;
                params.gradeCode = this.curClassInfo.gradeCode;
                res = await qualityApi.exportClassHonorExl(params);
            }
            const blob = new Blob([res], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '订单信息.xls'; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
            // console.log("123")
        },
    }
}
</script>

<style lang='scss' scoped>
.classDetailHead{
    padding: 20px 30px;
    width: 100%;
    color: #262626;
    border-bottom: 1px solid #e2e2e2;
    .tit{
        .classname{
            font-family: 'fz';
            font-size: 32px;
        }
        .classmaster{
            color: #444;
            padding-left: 50px;
            font-size: 16px;
        }
    }
    .infoDetail{
        padding: 10px 0;
        font-size: 14px;
        color: #444;
        span{
            padding-right: 80px;
        }
    }
    .infoHistroy{
        font-size: 14px;
        color: #444;
        span{
            padding-right: 10px;
            
        }
        /deep/ b{
            padding-right: 15px;
        }
    }
}
.classDetailBody{
    width: 100%;
}
.filter-container{
    min-height: 60px;
    .filterCol{
        float: left; margin-right: 30px;
    }
}
.classTabsBox{
    width: 100%;
    border: none;
    height: 100%;
    box-shadow: none;
    /deep/ .el-tabs__content{
        padding: 0;
    }
}
.pagination{
    margin: 0;
}
.m_GenTableBox.mini{
    width: 50%;
    float: left;
}
.check{
    color: #409EFF;
    cursor: pointer;
}
.taskImgList{
    .taskImgBox{
        width: 90px;
        height: 90px;
        float: left;
        margin: 5px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.detailMain{
    width: 100%;
    height: 400px;
    overflow: auto;
    .timeHead{
        width: 100%;
        font-size: 14px;
        padding: 5px 10px;
        background: #e2e2e2;
        color: #333;
        border-radius: 4px;
    }
    .completionStatus{
        padding: 5px 10px;
        .date{
            width: 100%;
            position: relative;
            font-size: 14px;
            color: #999;
            .status{
                color: #333;
                float: right;
            }
            .status.pass{
                color: #FF9600;
                font-weight: bold;
            }
        }
        .previewText{
            line-height: 30px;
        }
        
    }
}
.auditBox{
    .center{
        padding: 5px;
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }
    .reasonBox{
        margin: 5px 0;
        width: 100%;
        height: 50px;
        border: 1px solid #e2e2e2;
    }
}
.remark /deep/ em{
    color: #bbb;
}
</style>