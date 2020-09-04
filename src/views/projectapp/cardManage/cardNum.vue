<template>
    <div class="app-container calendar-list-container">

        <div class="u_TableMain">
            <div class="filter-container">

                <el-input placeholder="请输入内容" v-model="keyWords" class="input-with-select" style="width: 200px;" clearable> 
                </el-input>
                <!-- <el-button class="filter-item" type="primary" style="margin-left: 5px;" v-waves icon="search" @click="handleFilter">搜索</el-button> -->

                <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="primary" icon="edit">新增卡号</el-button>
                <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="warning" icon="edit">批量导入</el-button>
            </div>

            <div class="m_GenTableBox">
                <el-table :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" prop="cardNumber" label="卡号">
                    </el-table-column>
                    <el-table-column align="center" prop="usedTimes" label="总兑换次数">
                       
                    </el-table-column>
                    <el-table-column align="center" prop="cycleUsedTimes" label="周期内兑换次数">
                    </el-table-column>
                    <el-table-column align="center" prop="status" label="状态">
                        <template slot-scope="scope">
                        <el-link :type="scope.row.status==1?'success':'warning'">{{scope.row.status==1?'正常':'锁定'}}</el-link>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="exchangeRecord(scope.row)" icon="el-icon-edit" size="mini">兑换记录</el-button>

                            <el-button :type="scope.row.status==1?'warning':'success'" @click="lockCard(scope.row)" style="margin-left:0;" icon="el-icon-edit" size="mini">{{scope.row.status==1?'锁定':'解锁'}}</el-button>
                            
                            <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                <p>是否删除此卡号</p>
                                <div style="text-align: right;">
                                    <el-button size="mini" type="text" @click="scope.row.deltips = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="cardDel(scope.row)">确定</el-button>
                                </div>
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-popover>
                            
                            <!-- <el-button type="primary" @click="addRecord(scope.row)" size="mini">添加测试兑换记录</el-button> -->

                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="pagination"
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="listQuery.limit"
                    :current-page="listQuery.page"
                    @current-change="handleCurrentChange">
                </el-pagination>
                
            </div>
        </div>

        <el-dialog title="新增卡号" :visible.sync="dialogFormVisible" :close-on-click-modal='false' width="400px">
            <div class="limitHeight">
                <el-form :model="form" ref="form" label-width="60px" style="padding-right:30px;">
                    <el-row :gutter="16">
                        <el-form-item class="cardLine" label="卡号" v-for="(item,index) in cardList" :key="index">
                            <el-input :maxlength="36" onkeyup="value=value.replace(/[^\d]/g,'')" size="small" v-model="item.cardNumber" placeholder=""></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <el-row :gutter="24" class="addLine">
                <el-button style="width:100%;" @click="addCardNum" size="small" type="primary">新 增 卡 号</el-button>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createCard('form')" :disabled="changeSure">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="兑换记录" :visible.sync="dialogRecord" width="500px" :close-on-click-modal='false'>
            <div class="dialogSearch">
                <span>选择班级：</span>

                <el-cascader class="selClass" style="width:150px;" size="small" placeholder="选择班级" v-model="classSelCode" :options="NjBjList" filterable :props="{ children:'bjList', expandTrigger: 'hover' }" clearable></el-cascader>

                <el-input placeholder="请输入内容" size="small" v-model="recordkeyWords" class="input-with-select" style="width: 150px;" clearable></el-input>

                <!-- <el-button size="small" class="filter-item" type="primary" style="margin-left: 5px;" v-waves icon="search" @click="handleFilter">搜索</el-button> -->

            </div>

            <div class="">
                <el-table :data="recordList" v-loading.body="listLoading" fit highlight-current-row style="width: 100%;margin-top:10px;">
                    <el-table-column align="center" prop="createTime" label="兑换时间">
                    </el-table-column>
                    <el-table-column align="center" prop="userName" label="学生姓名">
                    </el-table-column>
                    <el-table-column align="center" prop="className" label="所在班级">
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="pagination"
                    background
                    layout="prev, pager, next"
                    :total="recordTotal"
                    :page-size="recordQuery.limit"
                    :current-page="recordQuery.page"
                    @current-change="handleCurrentRecordChange">
                </el-pagination>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeRecord">关 闭</el-button>
            </div>
        </el-dialog>







    </div>

</template>

<script>
import _ from 'lodash';
import {getCurrentXnxq} from '@/api/admin/acadyear';
import {GetNjBjList} from '@/api/admin/class';
import * as cardApi from '@/api/projectapp/cardManage';
import * as api from '@/api/projectapp/evaluationSetting';
export default {
    name:'cardManage',
    data(){
        return{
            listQuery:{
                page: 1,
                limit: 20
            },
            keyWords:'',
            recordkeyWords:'',
            searchsel: 'name', // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）
            listLoading:false,
            list:[],
            dialogFormVisible: false,
            dialogRecord:false,
            dialogStatus: '',
            textMap: {
                // 判断弹层是添加还是编辑
                update: '编辑',
                create: '新增卡号'
            },
            form: {}, 
            changeSure: false, // 防止重复提交
            rules: {},
            classSelCode:'',
            cardList:[],
            categoryId:'',
            total:0,
            recordList:[],
            recordTotal:0,
            recordQuery:{
                page: 1,
                limit: 10
            },
            NjBjList:[],
            xnxq:'',
        }
    },
    watch:{
        keyWords(val){
            this.handleFilter();
        },
        recordkeyWords(val){
            this.recordQuery.page = 1;
            this.recordQuery.name = val;
            this.getRecordList();
        },
        classSelCode(val){
            this.recordQuery.page = 1;
            this.recordQuery.classCode = val[val.length-1];
            this.getRecordList();
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.cardList = [{cardNumber:''}];
            this.categoryId = this.$route.query.id;
            this.listQuery.categoryId = this.categoryId;
            this.getCardList();
            this.getCurXnXq();
        },
        initRecordQuery(){
            this.recordQuery = {};
            this.recordQuery.page = 1;
            this.recordQuery.limit = 10;
            this.recordkeyWords = '';
            this.classSelCode = '';
            this.recordList = [];
            this.recordTotal = 0;
        },
        async getCurXnXq(){
            let res = await getCurrentXnxq({xxdm:window.localStorage.getItem('xxdm')});
            this.xnxq = res.data.xn;
            // console.log(res,"当前学年学期")
        },
        async getCardList(){
            let res = await cardApi.pageCardList(this.listQuery);
            // console.log(res,"listRes");
            if(res.resultCode==1){
                this.total = res.value.totalCount;
                this.list = res.value.dataList;
                if(this.list.length==0&&this.listQuery.page!=1){
                    this.listQuery.page--;
                    this.getCardList();
                }
            }else{
                this.$notify({title:'提示',message:res.resultMessage,type:'error'});
            }
        },
        handleFilter(){
            this.listQuery.keyWords = this.keyWords;
            this.getCardList();
        },
        handleCreate(){
            this.dialogFormVisible = true;
            this.cardList = [{cardNumber:''}]
            this.dialogStatus = 'create';
        },
        closeRecord(){
            this.dialogRecord = false;
            this.recordQuery = {};
            this.recordQuery.page = 1;
            this.recordQuery.limit = 20;
            this.recordkeyWords = '';
            this.classSelCode = '';
        },
        cancel(){

        },
        create(){

        },
        update(){

        },
        //根据hasMedal来检查是否可选
        checkDisable(arr){

        },
        cardNumManage(){
           
        },
        handleCurrentChange(val){
            this.listQuery.page = val;
            this.getCardList();
        },
        handleCurrentRecordChange(val){
            this.recordQuery.page = val;
            this.getRecordList();
        },
        addCardNum(){
            this.cardList.push({cardNumber:''})
            // console.log(this.cardList);
        },
        async lockCard(item){
            // console.log(item,"item")
            item.status = item.status==1?2:1;
            var param = {}
            param.categoryId = this.categoryId;
            param.cardInfo = [item];
            let res = await cardApi.addOrUpdateInfoCardNum(param);
            this.getCardList();
        },
        async createCard(){
            let param = {};
            // console.log(this.categoryId,"categoryId");
            param.categoryId = this.categoryId;
            param.cardInfo = [];
            for(let i=0;i<this.cardList.length;i++){
                if(this.cardList[i].cardNumber){
                    param.cardInfo.push({cardNumber:this.cardList[i].cardNumber})
                }
            }
            let res = await cardApi.addOrUpdateInfoCardNum(param);
            if(res.resultCode==1){
                if(res.value.failList.length>0){
                    this.$notify({title:'提示',
                    dangerouslyUseHTMLString: true,
                    message: '<strong>卡号部分录入,错误卡号为：</strong><br>' + res.value.failList.join(','),
                    type: 'warning',duration:0});
                }else{
                    this.$notify({title:'提示',message:res.resultMessage,type:'success'});
                }
                this.getCardList();
                this.dialogFormVisible = false;
            }else{
                this.$notify({title:'提示',message:res.resultMessage,type:'error'});
            }
            // console.log(res,"res新卡号")
        },
        async cardDel(item){
            // console.log(item,"item")
            var idsArr = [];
            idsArr.push(item.id)
            let res = await cardApi.deleteCardCode(idsArr);
            if(res.resultCode==1){
                this.$notify({title:'提示',message:res.resultMessage,type:'success'});
                this.getCardList();
            }else{
                this.$notify({title:'提示',message:res.resultMessage,type:'error'});
            }
        },
        async exchangeRecord(item){
            this.initRecordQuery();
            this.dialogRecord = true;
            if(this.NjBjList.length==0){
                let res = await GetNjBjList({xxdm:window.localStorage.getItem('xxdm'),xndm:this.xnxq})
                this.NjBjList = res.data;
                for(var i=0;i<this.NjBjList.length;i++){
                    this.NjBjList[i].label = this.NjBjList[i].njmc;
                    this.NjBjList[i].value = this.NjBjList[i].njdm;
                    for(var j=0;j<this.NjBjList[i].bjList.length;j++){
                        this.NjBjList[i].bjList[j].value = this.NjBjList[i].bjList[j].uuid;
                        this.NjBjList[i].bjList[j].label = this.NjBjList[i].bjList[j].bj;
                    }
                }
                // console.log(res,"年级班级列表")
            }
            this.getRecordList(item);
        },
        async getRecordList(item){
            if(item){
                this.recordQuery.cardId = item.id
            }
            let res = await cardApi.recordPageList(this.recordQuery);
            this.recordList = res.value.dataList;
            this.recordTotal = res.value.totalCount;
            // console.log(res,"兑换记录列表")
        },
        async addRecord(item){
            let param = {};
            param.cardNumber = item.cardNumber;
            param.classCode = '2019154410201';
            param.className = '一(1)班级';
            param.gradeCode = '21';
            param.userId = '103';
            param.userName = '杜拉拉';
            // {
            // "cardNumber": "string",
            // "classCode": "string",
            // "className": "string",
            // "gradeCode": "string",
            // "id": 0,
            // "schoolCode": "string",
            // "userId": "string",
            // "userName": "string"
            // }
            let res = await cardApi.recordSave(param);
            // console.log(res,'新增兑换记录')
        },
    }
}
</script>

<style lang='scss' scope>
.dialogSearch{
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 20px;
}
.addLine{
    padding: 0 15px;
}
.cardLine{
    margin-bottom: 10px;
}
.limitHeight{
    max-height: 400px;
    overflow: auto;
}
</style>